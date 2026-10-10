/**
 * Test authentication and environment helper for CodeArena client integration tests.
 * Provides dynamic guest session creation conforming to server-authoritative HMAC/JWT guest auth.
 */

export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export interface TestUser {
  userId: string;
  token: string;
  username: string;
  displayName: string;
}

/**
 * Creates an authentic guest session via POST /api/v1/auth/guest.
 * Completely replaces obsolete mock_test_token_* and clerkId references.
 */
export async function createTestGuest(displayName: string): Promise<TestUser> {
  const res = await fetch(`${BACKEND_URL}/api/v1/auth/guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName }),
  });

  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error(`Failed to create guest user for '${displayName}': ${JSON.stringify(json)}`);
  }

  return {
    userId: json.data.user.id,
    token: json.data.token,
    username: json.data.user.username,
    displayName: json.data.user.displayName,
  };
}

/**
 * Creates an authentic registered native user via POST /api/v1/auth/register.
 */
export async function createTestNativeUser(prefix: string): Promise<TestUser> {
  const rand = Math.floor(Math.random() * 1000000);
  const username = `${prefix}_${rand}`.slice(0, 20);
  const email = `${username}@test.com`;
  const password = `TestPass123!@#${rand}`.slice(0, 30);
  const displayName = `Display ${prefix}`;

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, displayName }),
  });

  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error(`Failed to register native user '${username}': ${JSON.stringify(json)}`);
  }

  return {
    userId: json.data.user.id || json.data.user._id,
    token: json.data.accessToken || json.data.token,
    username: json.data.user.username,
    displayName: json.data.user.displayName,
  };
}

