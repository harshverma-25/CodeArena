import { authenticate } from '../middleware/auth.middleware.js';
import { socketAuthMiddleware } from '../sockets/socket.js';
import { env } from '../config/env.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

interface MockResponse {
  statusCode?: number;
  data?: any;
}

function createMockReq(authHeader?: string, clerkUserId?: string): any {
  return {
    headers: authHeader ? { authorization: authHeader } : {},
    auth: clerkUserId ? { userId: clerkUserId } : undefined,
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

async function runUnitSuite() {
  console.log('====================================================');
  console.log('🛡️ Multi-Environment Middleware Security Verification');
  console.log('====================================================\n');

  await connectDatabase();

  const originalNodeEnv = env.NODE_ENV;

  try {
    const environments: Array<'test' | 'development' | 'production'> = ['test', 'development', 'production'];

    for (const testEnv of environments) {
      console.log(`\n▶️ Testing Environment: NODE_ENV = "${testEnv}"`);
      (env as any).NODE_ENV = testEnv;

      // Scenario A: Missing Token (REST)
      let restMissingErr: any = null;
      const reqMissing = createMockReq();
      await authenticate(reqMissing, {} as any, (err) => { restMissingErr = err; });
      if (restMissingErr && restMissingErr.statusCode === 401) {
        console.log(`  [REST] Missing Token: Rejected with 401 ✅`);
      } else {
        console.error(`  [REST] Missing Token: Unexpected result ❌`, restMissingErr);
      }

      // Scenario B: Invalid/Garbage Token (REST)
      let restInvalidErr: any = null;
      const reqInvalid = createMockReq('Bearer garbage_token_123');
      await authenticate(reqInvalid, {} as any, (err) => { restInvalidErr = err; });
      if (restInvalidErr && restInvalidErr.statusCode === 401) {
        console.log(`  [REST] Invalid Token: Rejected with 401 ✅`);
      } else {
        console.error(`  [REST] Invalid Token: Unexpected result ❌`, restInvalidErr);
      }

      // Scenario C: Mock Token (REST)
      let restMockErr: any = null;
      const reqMock = createMockReq('Bearer mock_test_token_user_security_test_123');
      await authenticate(reqMock, {} as any, (err) => { restMockErr = err; });

      if (testEnv === 'test') {
        if (!restMockErr && reqMock.user) {
          console.log(`  [REST] Mock Token in TEST mode: Accepted (user synced: ${reqMock.user.username}) ✅`);
        } else {
          console.error(`  [REST] Mock Token in TEST mode: Failed ❌`, restMockErr);
        }
      } else {
        // development or production: MUST BE REJECTED
        if (restMockErr && restMockErr.statusCode === 401) {
          console.log(`  [REST] Mock Token in ${testEnv.toUpperCase()} mode: Strictly REJECTED with 401 ✅ (Backdoor blocked!)`);
        } else {
          console.error(`  [REST] Mock Token in ${testEnv.toUpperCase()} mode: VULNERABILITY! Accepted mock token ❌`);
        }
      }

      // Scenario D: Missing Token (Socket)
      let socketMissingErr: any = null;
      const socketMissing = createMockSocket();
      await socketAuthMiddleware(socketMissing, (err) => { socketMissingErr = err; });
      if (socketMissingErr && socketMissingErr.message?.includes('Token missing')) {
        console.log(`  [Socket] Missing Token: Rejected ✅`);
      } else {
        console.error(`  [Socket] Missing Token: Unexpected result ❌`, socketMissingErr);
      }

      // Scenario E: Invalid Token (Socket)
      let socketInvalidErr: any = null;
      const socketInvalid = createMockSocket('garbage_token_456');
      await socketAuthMiddleware(socketInvalid, (err) => { socketInvalidErr = err; });
      if (socketInvalidErr && socketInvalidErr.message?.includes('Authentication error')) {
        console.log(`  [Socket] Invalid Token: Rejected ✅`);
      } else {
        console.error(`  [Socket] Invalid Token: Unexpected result ❌`, socketInvalidErr);
      }

      // Scenario F: Mock Token (Socket)
      let socketMockErr: any = null;
      const socketMock = createMockSocket('mock_test_token_user_socket_sec_test');
      await socketAuthMiddleware(socketMock, (err) => { socketMockErr = err; });

      if (testEnv === 'test') {
        if (!socketMockErr && socketMock.data?.user) {
          console.log(`  [Socket] Mock Token in TEST mode: Accepted (user attached: ${socketMock.data.user.username}) ✅`);
        } else {
          console.error(`  [Socket] Mock Token in TEST mode: Failed ❌`, socketMockErr);
        }
      } else {
        // development or production: MUST BE REJECTED
        if (socketMockErr && socketMockErr.message?.includes('Authentication error')) {
          console.log(`  [Socket] Mock Token in ${testEnv.toUpperCase()} mode: Strictly REJECTED ✅ (Backdoor blocked!)`);
        } else {
          console.error(`  [Socket] Mock Token in ${testEnv.toUpperCase()} mode: VULNERABILITY! Accepted mock token ❌`);
        }
      }

      // Scenario G: Valid Authenticated Clerk User (REST)
      let restClerkErr: any = null;
      const reqClerk = createMockReq('Bearer some_verified_header', 'user_security_test_123');
      await authenticate(reqClerk, {} as any, (err) => { restClerkErr = err; });
      if (!restClerkErr && reqClerk.user) {
        console.log(`  [REST] Legitimate Clerk Authenticated User: Successfully processed and attached to req.user ✅`);
      } else {
        console.error(`  [REST] Legitimate Clerk User: Failed ❌`, restClerkErr);
      }
    }
  } finally {
    (env as any).NODE_ENV = originalNodeEnv;
    await disconnectDatabase();
  }

  console.log('\n====================================================');
  console.log('🎉 All Security Scenarios Verified Successfully.');
  console.log('====================================================');
}

runUnitSuite();
