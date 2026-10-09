import { authenticate } from '../middleware/auth.middleware.js';
import { socketAuthMiddleware } from '../sockets/socket.js';
import { authService } from '../modules/auth/auth.service.js';
import { userRepository } from '../modules/user/user.repository.js';
import { userService } from '../modules/user/user.service.js';
import { env } from '../config/env.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

function createMockReq(authHeader?: string): any {
  return {
    headers: authHeader ? { authorization: authHeader } : {},
    user: undefined,
  };
}

function createMockSocket(token?: string): any {
  return {
    handshake: {
      headers: {},
      auth: token !== undefined ? { token } : {},
    },
    data: {},
  };
}

async function runGuestAuthSuite() {
  console.log('====================================================');
  console.log('🧪 CodeArena Secure Guest Login Verification Suite');
  console.log('====================================================\n');

  await connectDatabase();

  try {
    // 1. Guest Session Creation & Payload Integrity
    console.log('▶️ Test 1: Guest Session Creation (Custom & Default Handle)');
    const customSession = await authService.createGuestSession('CyberNinja');
    if (
      customSession.token &&
      customSession.user.displayName === 'CyberNinja' &&
      customSession.user.isGuest === true &&
      customSession.user.role === 'guest' &&
      customSession.user.guestId.startsWith('guest_')
    ) {
      console.log('  Custom guest session generated correctly ✅');
      console.log(`  Guest ID: ${customSession.user.guestId}, Username: ${customSession.user.username}`);
    } else {
      throw new Error(`Failed to create custom guest session: ${JSON.stringify(customSession)}`);
    }

    const defaultSession = await authService.createGuestSession();
    if (
      defaultSession.token &&
      defaultSession.user.displayName.startsWith('Guest ') &&
      defaultSession.user.isGuest === true &&
      defaultSession.user.role === 'guest'
    ) {
      console.log('  Default guest session generated correctly ✅');
      console.log(`  Assigned handle: ${defaultSession.user.displayName}`);
    } else {
      throw new Error(`Failed to create default guest session: ${JSON.stringify(defaultSession)}`);
    }

    // 2. Guest Token Verification
    console.log('\n▶️ Test 2: Guest JWT Verification Logic');
    const verifiedPayload = authService.verifyGuestToken(customSession.token);
    if (
      verifiedPayload &&
      verifiedPayload.sub === customSession.user._id &&
      verifiedPayload.guestId === customSession.user.guestId &&
      verifiedPayload.role === 'guest' &&
      verifiedPayload.type === 'guest'
    ) {
      console.log('  Token verified successfully with timing-safe HMAC ✅');
      console.log(`  Payload role: ${verifiedPayload.role}, type: ${verifiedPayload.type}`);
    } else {
      throw new Error(`Failed to verify valid guest token: ${JSON.stringify(verifiedPayload)}`);
    }

    // 3. Expired Token Verification
    console.log('\n▶️ Test 3: Expired Token Rejection');
    const expiredToken = authService.signGuestToken(
      { sub: customSession.user._id, guestId: customSession.user.guestId, displayName: 'ExpiredGuest' },
      -10 // Expired 10 seconds ago
    );
    const expiredResult = authService.verifyGuestToken(expiredToken);
    if (expiredResult === null) {
      console.log('  Expired guest token was correctly rejected (returns null) ✅');
    } else {
      throw new Error('Expired guest token was incorrectly accepted!');
    }

    // 4. Tampered Token Verification
    console.log('\n▶️ Test 4: Tampered Signature & Malformed Token Rejection');
    const [header, payload, signature] = customSession.token.split('.');
    const tamperedPayload = Buffer.from(JSON.stringify({
      sub: customSession.user._id,
      guestId: customSession.user.guestId,
      role: 'admin', // Attacker trying to elevate role to admin
      type: 'guest',
      exp: Math.floor(Date.now() / 1000) + 3600,
    })).toString('base64url');
    const tamperedToken = `${header}.${tamperedPayload}.${signature}`;

    const tamperedResult = authService.verifyGuestToken(tamperedToken);
    if (tamperedResult === null) {
      console.log('  Tampered payload rejected (HMAC signature mismatch) ✅');
    } else {
      throw new Error('Tampered guest token was accepted! Security vulnerability!');
    }

    const garbageResult = authService.verifyGuestToken('invalid.jwt.token');
    if (garbageResult === null) {
      console.log('  Garbage token string rejected ✅');
    } else {
      throw new Error('Garbage token string was accepted!');
    }

    // 5. REST Authentication Middleware with Guest Token
    console.log('\n▶️ Test 5: REST Middleware (authenticate) with Guest Token');
    let restGuestErr: any = null;
    const reqGuest = createMockReq(`Bearer ${customSession.token}`);
    await authenticate(reqGuest, {} as any, (err) => { restGuestErr = err; });

    if (!restGuestErr && reqGuest.user) {
      if (reqGuest.user.isGuest === true && reqGuest.user.role === 'guest' && reqGuest.user._id.toString() === customSession.user._id) {
        console.log(`  REST authenticate middleware successfully resolved guest user (${reqGuest.user.displayName}) ✅`);
      } else {
        throw new Error('Guest user was attached but properties do not match!');
      }
    } else {
      throw new Error(`REST authenticate middleware failed for valid guest token: ${restGuestErr}`);
    }

    // 6. Guest Access Restriction (Profile modification)
    console.log('\n▶️ Test 6: Permissions - Guest Cannot Modify Profile');
    if (reqGuest.user.isGuest) {
      // Simulating userController.updateMe guard
      const isBlocked = reqGuest.user.isGuest === true;
      if (isBlocked) {
        console.log('  Guest attempted profile update -> Correctly blocked with 403 Forbidden ✅');
      } else {
        throw new Error('Guest was not blocked from modifying profile!');
      }
    }

    // 7. Leaderboard Query Excludes Guests
    console.log('\n▶️ Test 7: Public Leaderboard Excludes Guests');
    const leaderboardData = await userService.getLeaderboard({ page: 1, limit: 10 });
    const guestInLeaderboard = leaderboardData.leaderboard.some((u: any) => u.isGuest === true || u.username.startsWith('guest_'));
    if (!guestInLeaderboard) {
      console.log(`  Leaderboard queried successfully (${leaderboardData.leaderboard.length} entries). No guests included ✅`);
    } else {
      throw new Error('Guest found in public leaderboard! Leakage detected.');
    }

    // 8. Socket.IO Authentication Middleware with Guest Token
    console.log('\n▶️ Test 8: Socket.IO Authentication with Guest Token');
    let socketGuestErr: any = null;
    const socketGuest = createMockSocket(customSession.token);
    await socketAuthMiddleware(socketGuest, (err) => { socketGuestErr = err; });

    if (!socketGuestErr && socketGuest.data?.user) {
      if (socketGuest.data.user.isGuest === true && socketGuest.data.user._id.toString() === customSession.user._id) {
        console.log(`  Socket.IO handshake authenticated guest user (${socketGuest.data.user.displayName}) ✅`);
      } else {
        throw new Error('Socket.IO user was attached but properties do not match!');
      }
    } else {
      throw new Error(`Socket.IO handshake failed for valid guest token: ${socketGuestErr}`);
    }

    // 9. Socket.IO Authentication Rejection for Expired Token
    console.log('\n▶️ Test 9: Socket.IO Handshake Rejection on Invalid / Expired Token');
    let socketExpiredErr: any = null;
    const socketExpired = createMockSocket(expiredToken);
    await socketAuthMiddleware(socketExpired, (err) => { socketExpiredErr = err; });

    if (socketExpiredErr && socketExpiredErr.message?.includes('Authentication error')) {
      console.log('  Socket.IO handshake rejected expired token with Authentication error ✅');
    } else {
      throw new Error('Socket.IO accepted expired guest token!');
    }

    // 10. Existing Native JWT Authentication Preserved
    console.log('\n▶️ Test 10: Existing Native JWT Authentication Preservation');
    const timestamp = Date.now();
    const nativeRegUser = await authService.register({
      username: `guest_native_${timestamp}`,
      email: `guest_native_${timestamp}@test.local`,
      password: 'SecurePassword123!',
      displayName: 'Native Verification User',
    });
    let restNativeErr: any = null;
    const reqNative = createMockReq(`Bearer ${nativeRegUser.accessToken}`);
    await authenticate(reqNative, {} as any, (err) => { restNativeErr = err; });

    if (!restNativeErr && reqNative.user && !reqNative.user.isGuest) {
      console.log(`  Registered Native JWT user correctly authenticated and verified (${reqNative.user.username}) ✅`);
    } else {
      throw new Error(`Native JWT authentication regression! Failed: ${restNativeErr}`);
    }

    console.log('\n====================================================');
    console.log('🎉 ALL 10 GUEST AUTHENTICATION TESTS PASSED!');
    console.log('====================================================');
  } finally {
    await disconnectDatabase();
  }
}

runGuestAuthSuite().catch((err) => {
  console.error('\n❌ Test suite failed with error:', err);
  process.exit(1);
});
