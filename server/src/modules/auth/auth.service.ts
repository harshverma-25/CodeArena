import crypto from 'crypto';
import { env } from '../../config/env.js';
import { userRepository } from '../user/user.repository.js';
import { IGuestTokenPayload, IGuestSessionResponse } from './auth.types.js';
import { logger } from '../../config/logger.js';
import { hashPassword, verifyPassword, hashToken } from '../../shared/utils/crypto-auth.js';
import { signJwtToken, verifyJwtToken, ITokenPayload } from '../../shared/utils/jwt.js';
import { ApiError } from '../../shared/errors/api-error.js';

export class AuthService {
  /**
   * Register a new native user account.
   */
  async register(data: {
    email: string;
    username: string;
    displayName?: string;
    password: string;
  }) {
    const email = data.email.trim().toLowerCase();
    const username = data.username.trim();
    const displayName = data.displayName?.trim() || username;
    const password = data.password;

    if (!email || !email.includes('@')) {
      throw new ApiError(400, 'Valid email address is required');
    }
    if (!username || username.length < 3) {
      throw new ApiError(400, 'Username must be at least 3 characters');
    }
    if (!password || password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters');
    }

    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(409, 'An account with this email already exists');
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw new ApiError(409, 'Username is already taken');
    }

    const passwordHash = hashPassword(password);
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;

    const user = await userRepository.create({
      email,
      username,
      displayName,
      passwordHash,
      avatar,
      isGuest: false,
      role: 'user',
    });

    const accessExpiry = parseInt(env.JWT_ACCESS_EXPIRES_IN, 10) || 900; // 15 mins
    const refreshExpiry = parseInt(env.JWT_REFRESH_EXPIRES_IN, 10) || 604800; // 7 days

    const familyId = crypto.randomUUID();
    const accessToken = signJwtToken(
      { sub: user._id.toString(), type: 'access', username: user.username, isGuest: false },
      env.JWT_ACCESS_SECRET,
      accessExpiry
    );

    const refreshToken = signJwtToken(
      { sub: user._id.toString(), type: 'refresh', familyId },
      env.JWT_REFRESH_SECRET,
      refreshExpiry
    );

    const tokenHash = hashToken(refreshToken);
    user.refreshTokenHash = tokenHash;
    user.refreshTokenFamilies = [
      {
        familyId,
        tokenHash,
        usedHashes: [],
        expiresAt: new Date(Date.now() + refreshExpiry * 1000),
        createdAt: new Date(),
      },
    ];
    await user.save();

    logger.info(`Native user registered: ${user.username} (${user._id})`);

    return {
      accessToken,
      refreshToken,
      expiresIn: accessExpiry,
      user: {
        _id: user._id.toString(),
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        isGuest: false,
        role: user.role,
      },
    };
  }

  /**
   * Authenticate a native user with email/username and password.
   */
  async login(data: { emailOrUsername: string; password: string }) {
    const input = data.emailOrUsername.trim().toLowerCase();
    const password = data.password;

    if (!input || !password) {
      throw new ApiError(400, 'Email/username and password are required');
    }

    const user = await userRepository.findByUsernameOrEmail(input);

    if (!user || !user.passwordHash) {
      throw new ApiError(401, 'Invalid email/username or password');
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new ApiError(401, 'Invalid email/username or password');
    }

    const accessExpiry = parseInt(env.JWT_ACCESS_EXPIRES_IN, 10) || 900;
    const refreshExpiry = parseInt(env.JWT_REFRESH_EXPIRES_IN, 10) || 604800;

    const familyId = crypto.randomUUID();
    const accessToken = signJwtToken(
      { sub: user._id.toString(), type: 'access', username: user.username, isGuest: false },
      env.JWT_ACCESS_SECRET,
      accessExpiry
    );

    const refreshToken = signJwtToken(
      { sub: user._id.toString(), type: 'refresh', familyId },
      env.JWT_REFRESH_SECRET,
      refreshExpiry
    );

    const tokenHash = hashToken(refreshToken);
    user.refreshTokenHash = tokenHash;

    const now = new Date();
    const activeFamilies = (user.refreshTokenFamilies || [])
      .filter((f) => f.expiresAt > now)
      .slice(-4); // retain at most 4 active families so new one caps at 5

    user.refreshTokenFamilies = [
      ...activeFamilies,
      {
        familyId,
        tokenHash,
        usedHashes: [],
        expiresAt: new Date(Date.now() + refreshExpiry * 1000),
        createdAt: new Date(),
      },
    ];
    await user.save();

    logger.info(`Native user logged in: ${user.username} (${user._id})`);

    return {
      accessToken,
      refreshToken,
      expiresIn: accessExpiry,
      user: {
        _id: user._id.toString(),
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        isGuest: false,
        role: user.role,
      },
    };
  }

  /**
   * Refresh an access token using a valid refresh token.
   * Enforces refresh token rotation and family-based reuse detection (RFC 6749 §10.4).
   */
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token is required');
    }

    const payload = verifyJwtToken(refreshToken, env.JWT_REFRESH_SECRET);
    if (!payload || payload.type !== 'refresh' || !payload.sub) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await userRepository.findByIdWithRefreshToken(payload.sub);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    const incomingHash = hashToken(refreshToken);
    const familyId = payload.familyId;
    const accessExpiry = parseInt(env.JWT_ACCESS_EXPIRES_IN, 10) || 900;
    const refreshExpiry = parseInt(env.JWT_REFRESH_EXPIRES_IN, 10) || 604800;

    // Check token family if familyId exists in token
    if (familyId && user.refreshTokenFamilies && user.refreshTokenFamilies.length > 0) {
      const familyIndex = user.refreshTokenFamilies.findIndex((f) => f.familyId === familyId);

      if (familyIndex !== -1) {
        const family = user.refreshTokenFamilies[familyIndex];

        // REUSE DETECTION: If incoming token has already been rotated/used, revoke entire family!
        if (family.usedHashes && family.usedHashes.includes(incomingHash)) {
          user.refreshTokenFamilies.splice(familyIndex, 1);
          if (user.refreshTokenFamilies.length === 0) {
            user.refreshTokenHash = undefined;
          }
          await user.save();
          logger.warn(
            `Refresh token reuse detected for user ${user._id}, family ${familyId}. Entire family revoked.`
          );
          throw new ApiError(401, 'Refresh token reuse detected. All sessions in this family have been revoked.');
        }

        // Validate that token matches currently active token in this family
        if (family.tokenHash !== incomingHash) {
          throw new ApiError(401, 'Invalid or revoked refresh token');
        }

        // Token is valid! Rotate token within same family:
        const newAccessToken = signJwtToken(
          { sub: user._id.toString(), type: 'access', username: user.username, isGuest: user.isGuest },
          env.JWT_ACCESS_SECRET,
          accessExpiry
        );

        const newRefreshToken = signJwtToken(
          { sub: user._id.toString(), type: 'refresh', familyId },
          env.JWT_REFRESH_SECRET,
          refreshExpiry
        );

        const newHash = hashToken(newRefreshToken);
        family.usedHashes.push(incomingHash);
        if (family.usedHashes.length > 10) {
          family.usedHashes = family.usedHashes.slice(-10);
        }
        family.tokenHash = newHash;
        family.expiresAt = new Date(Date.now() + refreshExpiry * 1000);
        user.refreshTokenHash = newHash;

        await user.save();

        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: accessExpiry,
          user: {
            _id: user._id.toString(),
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
            isGuest: user.isGuest || false,
            role: user.role,
          },
        };
      }
    }

    // Fallback for legacy tokens without familyId or if family record was cleared
    if (!user.refreshTokenHash || incomingHash !== user.refreshTokenHash) {
      throw new ApiError(401, 'Invalid or revoked refresh token');
    }

    const newAccessToken = signJwtToken(
      { sub: user._id.toString(), type: 'access', username: user.username, isGuest: user.isGuest },
      env.JWT_ACCESS_SECRET,
      accessExpiry
    );

    const newFamilyId = crypto.randomUUID();
    const newRefreshToken = signJwtToken(
      { sub: user._id.toString(), type: 'refresh', familyId: newFamilyId },
      env.JWT_REFRESH_SECRET,
      refreshExpiry
    );

    const newHash = hashToken(newRefreshToken);
    user.refreshTokenHash = newHash;
    user.refreshTokenFamilies = [
      ...(user.refreshTokenFamilies || []),
      {
        familyId: newFamilyId,
        tokenHash: newHash,
        usedHashes: [incomingHash],
        expiresAt: new Date(Date.now() + refreshExpiry * 1000),
        createdAt: new Date(),
      },
    ];
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: accessExpiry,
      user: {
        _id: user._id.toString(),
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        isGuest: user.isGuest || false,
        role: user.role,
      },
    };
  }

  /**
   * Revoke session on logout.
   */
  async logout(userId: string, refreshToken?: string) {
    if (userId) {
      if (refreshToken) {
        try {
          const payload = verifyJwtToken(refreshToken, env.JWT_REFRESH_SECRET);
          if (payload?.familyId) {
            await userRepository.clearRefreshTokenFamily(userId, payload.familyId);
            return;
          }
        } catch {
          // Fall through to clear all if verification fails
        }
      }
      await userRepository.clearRefreshToken(userId);
    }
  }

  /**
   * Verify native access token.
   */
  verifyAccessToken(token: string): ITokenPayload | null {
    const payload = verifyJwtToken(token, env.JWT_ACCESS_SECRET);
    if (payload && payload.type === 'access') {
      return payload;
    }
    return null;
  }

  // Preserve existing guest functions
  signGuestToken(
    payload: { sub: string; guestId: string; displayName: string },
    expiresInSeconds: number = 86400
  ): string {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + expiresInSeconds;

    const fullPayload: IGuestTokenPayload = {
      sub: payload.sub,
      guestId: payload.guestId,
      displayName: payload.displayName,
      role: 'guest',
      type: 'guest',
      iat,
      exp,
    };

    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac('sha256', env.GUEST_JWT_SECRET)
      .update(signatureInput)
      .digest('base64url');

    return `${signatureInput}.${signature}`;
  }

  verifyGuestToken(token: string): IGuestTokenPayload | null {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    try {
      const expectedSignature = crypto
        .createHmac('sha256', env.GUEST_JWT_SECRET)
        .update(signatureInput)
        .digest('base64url');

      const signatureBuffer = Buffer.from(signature, 'base64url');
      const expectedBuffer = Buffer.from(expectedSignature, 'base64url');

      if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
      ) {
        return null;
      }

      const payloadString = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
      const payload: IGuestTokenPayload = JSON.parse(payloadString);

      if (payload.type !== 'guest' || payload.role !== 'guest') return null;

      const now = Math.floor(Date.now() / 1000);
      if (typeof payload.exp !== 'number' || payload.exp < now) return null;

      if (!payload.guestId || !payload.guestId.startsWith('guest_')) return null;

      return payload;
    } catch {
      return null;
    }
  }

  async createGuestSession(customDisplayName?: string): Promise<IGuestSessionResponse> {
    const rawUuid = crypto.randomUUID().replace(/-/g, '');
    const guestId = `guest_${rawUuid.slice(0, 16)}`;
    const randomSuffix = crypto.randomBytes(3).toString('hex').toLowerCase();
    const username = `guest_${randomSuffix}`;

    const displayName = customDisplayName?.trim() || `Guest ${randomSuffix.toUpperCase()}`;
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;

    const user = await userRepository.create({
      username,
      displayName,
      avatar,
      isGuest: true,
      role: 'guest',
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      accuracy: 0,
      highestWinStreak: 0,
    });

    const expiresIn = 86400; // 24 hours
    const token = this.signGuestToken(
      {
        sub: user._id.toString(),
        guestId,
        displayName: user.displayName,
      },
      expiresIn
    );

    logger.info(`Guest session created for user ${user.username} (${user._id})`);

    return {
      token,
      user: {
        _id: user._id.toString(),
        guestId,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        isGuest: true,
        role: 'guest',
        expiresIn,
      },
    };
  }
}

export const authService = new AuthService();
export default authService;
