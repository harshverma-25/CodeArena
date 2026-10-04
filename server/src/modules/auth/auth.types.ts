export interface IGuestTokenPayload {
  sub: string; // MongoDB _id
  guestId: string; // e.g. guest_a1b2c3d4e5f6
  displayName: string;
  role: 'guest';
  type: 'guest';
  iat: number;
  exp: number; // Unix timestamp in seconds
}

export interface ICreateGuestRequest {
  displayName?: string;
}

export interface IGuestSessionResponse {
  token: string;
  user: {
    _id: string;
    clerkId: string;
    username: string;
    displayName: string;
    avatar: string;
    isGuest: boolean;
    role: string;
    expiresIn: number;
  };
}
