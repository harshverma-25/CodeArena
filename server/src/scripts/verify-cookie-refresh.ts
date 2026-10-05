import mongoose from 'mongoose';
import http from 'http';
import { app } from '../app.js';
import { env } from '../config/env.js';
import { UserModel } from '../modules/user/user.model.js';

async function runCookieRefreshTest() {
  console.log('=== STARTING HTTP COOKIE REFRESH & LOGOUT VERIFICATION ===\n');

  // Connect to DB
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  // Clean up test user
  await UserModel.deleteMany({ email: 'cookietest@codearena.com' });

  // Start HTTP server on random port
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;
  console.log(`Test server running on port ${port}.`);

  try {
    // 1. Register a test user
    console.log('\n▶️ Test 1: Register user and verify Set-Cookie header');
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'cookietest@codearena.com',
        username: 'cookietestuser',
        displayName: 'Cookie Tester',
        password: 'Password123!',
      }),
    });

    const regData = await regRes.json();
    if (!regRes.ok) {
      throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
    }

    const regSetCookie = regRes.headers.get('set-cookie');
    console.log('  Set-Cookie on Register:', regSetCookie);
    if (!regSetCookie || !regSetCookie.includes('refreshToken=')) {
      throw new Error('Expected refreshToken in Set-Cookie on registration');
    }
    if (!regSetCookie.includes('HttpOnly') && !regSetCookie.includes('httponly')) {
      throw new Error('Expected HttpOnly flag in Set-Cookie header');
    }
    console.log('  ✅ Checkpoint 1: Registration sets HttpOnly refreshToken cookie.');

    // Extract cookie value
    const match = regSetCookie.match(/refreshToken=([^;]+)/);
    const refreshTokenValue = match ? match[1] : '';
    if (!refreshTokenValue) {
      throw new Error('Failed to parse refreshToken from Set-Cookie header');
    }

    // 2. Call /auth/refresh with Cookie header (NO body)
    console.log('\n▶️ Test 2: Call /auth/refresh with Cookie header and empty body');
    const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': `refreshToken=${refreshTokenValue}`,
      },
    });

    const refreshData: any = await refreshRes.json();
    if (!refreshRes.ok) {
      throw new Error(`Refresh failed: ${JSON.stringify(refreshData)}`);
    }

    console.log('  Refresh Response data:', refreshData);
    if (!refreshData.data?.accessToken) {
      throw new Error('Expected new accessToken in refresh response');
    }

    const refreshSetCookie = refreshRes.headers.get('set-cookie');
    console.log('  Set-Cookie on Refresh:', refreshSetCookie);
    if (!refreshSetCookie || !refreshSetCookie.includes('refreshToken=')) {
      throw new Error('Expected rotated refreshToken in Set-Cookie on refresh');
    }
    console.log('  ✅ Checkpoint 2: /auth/refresh successfully read cookie and returned new tokens.');

    const newAccess = refreshData.data.accessToken;
    const newRefreshMatch = refreshSetCookie.match(/refreshToken=([^;]+)/);
    const newRefreshValue = newRefreshMatch ? newRefreshMatch[1] : '';

    // 3. Call /auth/logout with new access token
    console.log('\n▶️ Test 3: Call /auth/logout and verify cookie is cleared');
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${newAccess}`,
      },
    });

    const logoutData = await logoutRes.json();
    if (!logoutRes.ok) {
      throw new Error(`Logout failed: ${JSON.stringify(logoutData)}`);
    }

    const logoutSetCookie = logoutRes.headers.get('set-cookie');
    console.log('  Set-Cookie on Logout:', logoutSetCookie);
    if (!logoutSetCookie || (!logoutSetCookie.includes('refreshToken=;') && !logoutSetCookie.includes('Expires=Thu, 01 Jan 1970') && !logoutSetCookie.includes('Max-Age=0'))) {
      throw new Error('Expected cleared refreshToken in Set-Cookie header on logout');
    }
    console.log('  ✅ Checkpoint 3: /auth/logout successfully cleared the refresh cookie.');

    // 4. Verify that revoked refresh token fails on subsequent refresh
    console.log('\n▶️ Test 4: Verify revoked refresh token is rejected');
    const postLogoutRefresh = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': `refreshToken=${newRefreshValue}`,
      },
    });

    if (postLogoutRefresh.status === 401) {
      console.log('  ✅ Checkpoint 4: Revoked refresh token rejected with 401 Unauthorized.');
    } else {
      throw new Error(`Expected 401 on refresh after logout, got ${postLogoutRefresh.status}`);
    }

    console.log('\n==================================================');
    console.log('🎉 ALL HTTP COOKIE REFRESH & LOGOUT TESTS PASSED!');
    console.log('==================================================\n');
  } finally {
    server.close();
    await UserModel.deleteMany({ email: 'cookietest@codearena.com' });
    await mongoose.disconnect();
  }
}

runCookieRefreshTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
