import crypto from 'crypto';
import { env } from '../../config/env.js';
import { userRepository } from '../user/user.repository.js';
import { IGuestTokenPayload, IGuestSessionResponse } from './auth.types.js';
import { logger } from '../../config/logger.js';

export class AuthService {
  /**
   * Cryptographically sign a secure HS256 JWT for guest sessions.
   * Default expiration: 24 hours (86400 seconds).
   */
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

  /**
   * Verify and decode a backend-issued guest JWT.
   * Performs timing-safe HMAC validation, role checks, and expiration checks.
   */
  verifyGuestToken(token: string): IGuestTokenPayload | null {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    try {
      const expectedSignature = crypto
        .createHmac('sha256', env.GUEST_JWT_SECRET)
        .update(signatureInput)
        .digest('base64url');

      const signatureBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
      ) {
        return null;
      }

      const payloadString = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
      const payload: IGuestTokenPayload = JSON.parse(payloadString);

      // Verify explicit role and type
      if (payload.type !== 'guest' || payload.role !== 'guest') {
        return null;
      }

      // Verify expiration (Unix timestamp in seconds)
      const now = Math.floor(Date.now() / 1000);
      if (typeof payload.exp !== 'number' || payload.exp < now) {
        return null;
      }

      // Verify guest ID structure
      if (!payload.guestId || !payload.guestId.startsWith('guest_')) {
        return null;
      }

      return payload;
    } catch (err) {
      return null;
    }
  }

  /**
   * Provision a temporary guest user and return a signed 24-hour guest JWT session.
   */
  async createGuestSession(customDisplayName?: string): Promise<IGuestSessionResponse> {
    const rawUuid = crypto.randomUUID().replace(/-/g, '');
    const guestId = `guest_${rawUuid.slice(0, 16)}`;
    const randomSuffix = crypto.randomBytes(3).toString('hex').toLowerCase();
    const username = `guest_${randomSuffix}`;

    const displayName = customDisplayName?.trim() || `Guest ${randomSuffix.toUpperCase()}`;
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;

    const user = await userRepository.create({
      clerkId: guestId,
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
      preferredLanguage: 'javascript',
    });

    const expiresIn = 86400; // 24 hours
    const token = this.signGuestToken(
      {
        sub: user._id.toString(),
        guestId: user.clerkId,
        displayName: user.displayName,
      },
      expiresIn
    );

    logger.info(`Guest session created for user ${user.username} (${user._id})`);

    return {
      token,
      user: {
        _id: user._id.toString(),
        clerkId: user.clerkId,
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
