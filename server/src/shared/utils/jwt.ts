import crypto from 'crypto';

export interface ITokenPayload {
  sub: string; // userId (_id)
  type: 'access' | 'refresh' | 'guest';
  familyId?: string;
  jti?: string;
  username?: string;
  isGuest?: boolean;
  guestId?: string;
  displayName?: string;
  role?: string;
  iat: number;
  exp: number;
}

export function signJwtToken(
  payload: {
    sub: string;
    type: 'access' | 'refresh' | 'guest';
    familyId?: string;
    jti?: string;
    username?: string;
    isGuest?: boolean;
    guestId?: string;
    displayName?: string;
    role?: string;
  },
  secret: string,
  expiresInSeconds: number
): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;
  const jti = payload.jti || crypto.randomUUID();

  const fullPayload: ITokenPayload = {
    ...payload,
    jti,
    iat,
    exp,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(signatureInput)
    .digest('base64url');

  return `${signatureInput}.${signature}`;
}

export function verifyJwtToken(token: string, secret: string): ITokenPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
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
    const payload: ITokenPayload = JSON.parse(payloadString);

    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
