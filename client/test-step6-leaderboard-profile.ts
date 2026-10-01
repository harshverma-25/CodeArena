import { io, Socket } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:5000';

const USER_1 = {
  clerkId: 'user_3HIxvzCofKPVuwGi0EMZbK3dUvO',
  token: 'mock_test_token_user_3HIxvzCofKPVuwGi0EMZbK3dUvO',
  username: 'AliceHost',
};

const USER_2 = {
  clerkId: 'user_3HJivSFmHVygpLuuBo9IkwxsCti',
  token: 'mock_test_token_user_3HJivSFmHVygpLuuBo9IkwxsCti',
  username: 'BobChallenger',
};

async function getJSON(url: string, token: string) {
  const res = await fetch(`${BACKEND_URL}${url}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return { status: res.status, body: await res.json() };
}

async function patchJSON(url: string, data: any, token: string) {
  const res = await fetch(`${BACKEND_URL}${url}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return { status: res.status, body: await res.json() };
}

async function runStep6Test() {
  console.log('🚀 Starting Step 6 Leaderboard & Player Profile Integration Test...\n');

  // 1. Test GET /api/v1/leaderboard
  console.log('1. Testing GET /api/v1/leaderboard...');
  const lbRes = await getJSON('/api/v1/leaderboard?page=1&limit=10', USER_1.token);
  console.log(`   Response status: ${lbRes.status}`);

  if (lbRes.status !== 200 || !lbRes.body.success) {
    throw new Error(`Failed to fetch leaderboard: ${JSON.stringify(lbRes.body)}`);
  }

  const lbData = lbRes.body.data;
  console.log(`   - Total Players on Leaderboard: ${lbData.total}`);
  console.log(`   - Page: ${lbData.page}, Limit: ${lbData.limit}`);
  
  if (lbData.leaderboard.length > 0) {
    const topPlayer = lbData.leaderboard[0];
    console.log('   Top Ranked Player (#1):');
    console.log(`   - Rank: ${topPlayer.rank}`);
    console.log(`   - Username: @${topPlayer.username}`);
    console.log(`   - Wins: ${topPlayer.wins}, Battles: ${topPlayer.battlesPlayed}, Accuracy: ${topPlayer.accuracy}%`);
  }

  console.log(`   - Current User Rank Info: Rank #${lbData.currentUserRank?.rank || 'Unranked'} (@${lbData.currentUserRank?.username})`);
  console.log('   ✅ Global Leaderboard API functioning perfectly!');

  // 2. Test GET /api/v1/users/profile/me
  console.log('\n2. Testing GET /api/v1/users/profile/me (Authenticated Profile Stats)...');
  const myProfileRes = await getJSON('/api/v1/users/profile/me', USER_1.token);
  console.log(`   Response status: ${myProfileRes.status}`);

  if (myProfileRes.status !== 200 || !myProfileRes.body.success) {
    throw new Error(`Failed to fetch user profile stats: ${JSON.stringify(myProfileRes.body)}`);
  }

  const myProfile = myProfileRes.body.data;
  console.log(`   - Username: @${myProfile.username}`);
  console.log(`   - Display Name: ${myProfile.displayName}`);
  console.log(`   - Global Rank: #${myProfile.rank}`);
  console.log(`   - Completed Battles Played: ${myProfile.battlesPlayed}`);
  console.log(`   - Wins: ${myProfile.wins}, Losses: ${myProfile.losses}, Draws: ${myProfile.draws}`);
  console.log(`   - Total Correct: ${myProfile.totalCorrect}/${myProfile.totalQuestions}`);
  console.log(`   - Accuracy: ${myProfile.accuracy}%`);
  console.log(`   - Recent Completed Battles Count: ${myProfile.recentBattles.length}`);
  console.log('   ✅ Authenticated Profile Stats API functioning perfectly!');

  // 3. Test GET /api/v1/users/profile/:username (Public Profile)
  const targetUsername = lbData.leaderboard[0]?.username || 'user_wxsCti';
  console.log(`\n3. Testing GET /api/v1/users/profile/${targetUsername} (Public Profile of another user)...`);
  const publicRes = await getJSON(`/api/v1/users/profile/${targetUsername}`, USER_1.token);
  console.log(`   Response status: ${publicRes.status}`);

  if (publicRes.status !== 200 || !publicRes.body.success) {
    throw new Error(`Failed to fetch public profile: ${JSON.stringify(publicRes.body)}`);
  }

  const publicProfile = publicRes.body.data;
  console.log(`   - Username: @${publicProfile.username}`);
  console.log(`   - Rank: #${publicProfile.rank}`);
  console.log(`   - Wins: ${publicProfile.wins}, Battles: ${publicProfile.battlesPlayed}, Accuracy: ${publicProfile.accuracy}%`);
  console.log(`   - Is Email exposed? ${'email' in publicProfile ? 'YES (FAIL!)' : 'NO (PROTECTED)'}`);
  console.log(`   - Is Clerk ID exposed? ${'clerkId' in publicProfile ? 'YES (FAIL!)' : 'NO (PROTECTED)'}`);

  if ('email' in publicProfile || 'clerkId' in publicProfile) {
    throw new Error('❌ SECURITY FAILURE: Private user fields exposed in public profile!');
  }
  console.log('   ✅ Public profile API correctly protects private user data!');

  // 4. Test Security: Verify Users Cannot Modify Stats via PATCH /users/me
  console.log('\n4. Testing Security: Verifying users cannot modify stats via PATCH /users/me...');
  const patchRes = await patchJSON(
    '/api/v1/users/me',
    { wins: 9999, matchesPlayed: 9999, displayName: 'Alice Updated' },
    USER_1.token
  );
  console.log(`   Response status: ${patchRes.status}`);

  // Re-fetch profile to ensure wins was not altered to 9999
  const reFetchProfile = await getJSON('/api/v1/users/profile/me', USER_1.token);
  const updatedWins = reFetchProfile.body.data.wins;
  console.log(`   - Display Name updated to: "${patchRes.body.data.displayName}"`);
  console.log(`   - Wins after attempt: ${updatedWins} (Should NOT be 9999)`);

  if (updatedWins === 9999) {
    throw new Error('❌ SECURITY FAILURE: User was able to manually alter leaderboard stats!');
  }
  console.log('   ✅ Statistics protection verified! Users cannot modify leaderboard scores.');

  console.log('\n======================================================');
  console.log('🎉 ALL STEP 6 REQUIREMENTS VERIFIED AND PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

runStep6Test().catch((err) => {
  console.error('\n❌ Integration Test Error:', err);
  process.exit(1);
});
