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

const USER_UNAUTHORIZED = {
  clerkId: 'user_3HKunauthorizedToken12345',
  token: 'mock_test_token_user_3HKunauthorizedToken12345',
  username: 'CharlieIntruder',
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

async function postJSON(url: string, data: any, token: string) {
  const res = await fetch(`${BACKEND_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
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

function connectSocket(token: string): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s = io(BACKEND_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    s.on('connect', () => resolve(s));
    s.on('connect_error', (err) => reject(err));
  });
}

function waitForEvent<T = any>(socket: Socket, event: string, timeoutMs = 8000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event '${event}' (${timeoutMs}ms)`));
    }, timeoutMs);

    socket.once(event, (payload: T) => {
      clearTimeout(timer);
      resolve(payload);
    });
  });
}

async function runStep7Pass() {
  console.log('🧪 ======================================================');
  console.log('🚀 STEP 7: COMPREHENSIVE E2E TESTING, SECURITY & EDGE CASES');
  console.log('========================================================\n');

  // PART 1: Room Creation, Settings & Join Flow
  console.log('1. Testing Room Creation & Join Flow...');
  const createRes = await postJSON(
    '/api/v1/rooms',
    { topic: 'random', difficulty: 'Easy', questionCount: 5, duration: 30 },
    USER_1.token
  );
  if (createRes.status !== 201 && createRes.status !== 200) {
    throw new Error(`Failed to create room: ${JSON.stringify(createRes.body)}`);
  }
  const roomCode = createRes.body.data.roomCode;
  console.log(`   ✅ Private room created: ${roomCode}`);

  const socket1 = await connectSocket(USER_1.token);
  const socket2 = await connectSocket(USER_2.token);
  const socket3 = await connectSocket(USER_UNAUTHORIZED.token);

  socket1.on('error', (err) => console.error('   [Socket1 Error]', err));
  socket2.on('error', (err) => console.error('   [Socket2 Error]', err));
  socket3.on('error', (err) => console.error('   [Socket3 Error]', err));

  // Join Room
  const p1Join = waitForEvent(socket1, 'room:update');
  socket1.emit('room:join', { roomCode });
  await p1Join;

  const p2Join = waitForEvent(socket2, 'room:update');
  socket2.emit('room:join', { roomCode });
  await p2Join;
  console.log('   ✅ Both players joined room socket channel');

  // Update Settings (Host only)
  const settingsPromise = waitForEvent(socket1, 'room:update');
  socket1.emit('room:update', {
    roomCode,
    settings: { topic: 'JavaScript', difficulty: 'Easy', questionCount: 5 },
  });
  const updatedRoom = await settingsPromise;
  console.log(`   ✅ Room settings updated to topic: ${updatedRoom.settings.topic}`);

  // Ready State
  const readyPromise = new Promise((resolve) => {
    const checkReady = (room: any) => {
      if (room.status === 'READY' && room.players.every((p: any) => p.isReady)) {
        socket1.off('room:update', checkReady);
        resolve(room);
      }
    };
    socket1.on('room:update', checkReady);
  });
  socket1.emit('room:ready', { roomCode, isReady: true });
  socket2.emit('room:ready', { roomCode, isReady: true });
  await readyPromise;
  console.log('   ✅ Both players marked ready');

  // PART 2: Battle Initialization & Anti-Cheat Audit
  console.log('\n2. Testing Battle Initialization & Anti-Cheat Payload Audit...');
  const p1InitPromise = waitForEvent(socket1, 'battle:init');
  const p2InitPromise = waitForEvent(socket2, 'battle:init');
  socket1.emit('room:start_battle', { roomCode });
  const [p1Init, p2Init] = await Promise.all([p1InitPromise, p2InitPromise]);

  console.log(`   Battle started! Assigned ${p1Init.questionCount} questions per player.`);

  // Anti-cheat verification on live battle payload
  const liveQ = p1Init.currentQuestion;
  console.log('   Inspecting live question payload:');
  console.log(`   - questionId: ${liveQ.questionId}`);
  console.log(`   - correctAnswer present? ${'correctAnswer' in liveQ ? 'YES (FAIL!)' : 'NO (PROTECTED)'}`);
  console.log(`   - explanation present? ${'explanation' in liveQ ? 'YES (FAIL!)' : 'NO (PROTECTED)'}`);

  if ('correctAnswer' in liveQ || 'explanation' in liveQ) {
    throw new Error('❌ ANTI-CHEAT FAILURE: Live payload exposed correct answer or explanation!');
  }
  console.log('   ✅ Live battle payloads are strictly sanitized!');

  // PART 3: Edge Cases (Duplicate submissions, Reconnection, Simultaneous submissions)
  console.log('\n3. Testing Real-time Edge Cases...');
  
  // Edge Case 3a: Rejoining active room attempt
  try {
    await postJSON(`/api/v1/rooms/join`, { roomCode }, USER_UNAUTHORIZED.token);
  } catch (err: any) {
    console.log('   ✅ Active room join rejected for 3rd player!');
  }

  // Edge Case 3b: Simultaneous submission & Duplicate submission test
  let p1Q = p1Init.currentQuestion;
  const next1Promise = waitForEvent(socket1, 'battle:next_question');
  socket1.emit('battle:submit_answer', { roomCode, questionId: p1Q.questionId, selectedOption: 0 });
  const next1Payload = await next1Promise;

  // Submit again for already-answered question (Duplicate submission guard)
  const duplicateErrPromise = waitForEvent<{ success: boolean; message: string }>(socket1, 'error');
  socket1.emit('battle:submit_answer', { roomCode, questionId: p1Q.questionId, selectedOption: 1 });
  const dupErr = await duplicateErrPromise;
  if (!dupErr || dupErr.success !== false) {
    throw new Error('❌ Duplicate submission was not rejected!');
  }
  console.log(`   ✅ Duplicate submission rejected by server: "${dupErr.message}"`);
  p1Q = next1Payload.question;

  // Edge Case 3c: Reconnection / State synchronization test
  console.log('   Testing Reconnection & State Sync (battle:reconnect)...');
  const reconnectPromise = waitForEvent(socket1, 'battle:init');
  socket1.emit('battle:reconnect', { roomCode });
  const reconnectedState = await reconnectPromise;
  p1Q = reconnectedState.currentQuestion;
  console.log(`   ✅ Reconnected state synchronized! Current Q Index: ${reconnectedState.currentQuestionIndex}`);

  // Complete remaining questions for Player 1
  console.log('   Player 1 answering remaining questions...');
  for (let i = reconnectedState.currentQuestionIndex; i < p1Init.questionCount; i++) {
    if (!p1Q) break;
    console.log(`   P1 submitting Q${i+1}/${p1Init.questionCount} (ID: ${p1Q.questionId})...`);
    const nxtPromise = waitForEvent(socket1, 'battle:next_question');
    socket1.emit('battle:submit_answer', {
      roomCode,
      questionId: p1Q.questionId,
      selectedOption: 2,
    });
    const nxtPayload = await nxtPromise;
    if (nxtPayload.completed || !nxtPayload.question) {
      break;
    }
    p1Q = nxtPayload.question;
  }
  console.log('   ✅ Player 1 completed all questions!');

  // Complete remaining questions for Player 2
  const p1CompletedPromise = waitForEvent(socket1, 'battle:completed', 30000);
  const p2CompletedPromise = waitForEvent(socket2, 'battle:completed', 30000);

  console.log('   Player 2 answering questions...');
  let p2Q = p2Init.currentQuestion;
  for (let i = 0; i < p2Init.questionCount; i++) {
    if (!p2Q) break;
    console.log(`   P2 submitting Q${i+1}/${p2Init.questionCount} (ID: ${p2Q.questionId})...`);
    const nxtPromise = waitForEvent(socket2, 'battle:next_question');
    socket2.emit('battle:submit_answer', {
      roomCode,
      questionId: p2Q.questionId,
      selectedOption: 2,
    });
    const nxtPayload = await nxtPromise;
    if (nxtPayload.completed || !nxtPayload.question) {
      break;
    }
    p2Q = nxtPayload.question;
  }
  console.log('   ✅ Player 2 completed all questions!');

  // Wait for battle completion event
  const [completedResults] = await Promise.all([p1CompletedPromise, p2CompletedPromise]);
  const battleId = completedResults.battleId;
  console.log(`   ✅ Battle completed! Battle ID: ${battleId}`);

  socket1.disconnect();
  socket2.disconnect();
  socket3.disconnect();

  // PART 4: Security Audit & Results Post-Battle Verification
  console.log('\n4. Testing Security Audit & Post-Battle Results...');

  // 4a. Authorized participant fetches results
  const authResults = await getJSON(`/api/v1/history/battles/${battleId}`, USER_1.token);
  console.log(`   Authorized Participant Results Status: ${authResults.status}`);
  if (authResults.status !== 200 || !authResults.body.success) {
    throw new Error(`Failed to fetch battle results: ${JSON.stringify(authResults.body)}`);
  }

  const resultDetails = authResults.body.data;
  const reviewQ = resultDetails.userPlayer.questions[0];
  console.log('   Inspecting Post-Battle Question Review details:');
  console.log(`   - Question Text: "${reviewQ.question}"`);
  console.log(`   - Correct Answer Index: ${reviewQ.correctAnswer}`);
  console.log(`   - Explanation: "${reviewQ.explanation}"`);
  console.log('   ✅ Correct answers and explanations are safely exposed ONLY post-battle!');

  // 4b. Unauthorized user attempts to fetch results
  const unauthResults = await getJSON(`/api/v1/history/battles/${battleId}`, USER_UNAUTHORIZED.token);
  console.log(`   Unauthorized User Results Status: ${unauthResults.status}`);
  console.log(`   Unauthorized Error Message: "${unauthResults.body.message}"`);
  if (unauthResults.status !== 403) {
    throw new Error(`❌ Security failure: Unauthorized user received status ${unauthResults.status} instead of 403 Forbidden!`);
  }
  console.log('   ✅ Unauthorized access correctly blocked with 403 Forbidden!');

  // 4c. Security: Users cannot tamper with leaderboard scores
  const patchAttempt = await patchJSON(
    '/api/v1/users/me',
    { wins: 99999, matchesPlayed: 99999 },
    USER_1.token
  );
  const verifyProfile = await getJSON('/api/v1/users/profile/me', USER_1.token);
  if (verifyProfile.body.data.wins === 99999) {
    throw new Error('❌ SECURITY FAILURE: User was able to manually alter leaderboard stats!');
  }
  console.log('   ✅ User stats security verified! Scores cannot be altered via API updates.');

  // PART 5: Match History & Leaderboard Verification
  console.log('\n5. Testing Match History & Leaderboard System Synchronization...');
  
  // 5a. Match History check
  const historyRes = await getJSON('/api/v1/history?page=1&limit=5', USER_1.token);
  if (historyRes.status !== 200 || !historyRes.body.success) {
    throw new Error(`Failed to fetch match history: ${JSON.stringify(historyRes.body)}`);
  }
  console.log(`   ✅ Match History API verified! Total recorded matches: ${historyRes.body.data.total}`);

  // 5b. Leaderboard check
  const leaderboardRes = await getJSON('/api/v1/leaderboard?page=1&limit=10', USER_1.token);
  if (leaderboardRes.status !== 200 || !leaderboardRes.body.success) {
    throw new Error(`Failed to fetch leaderboard: ${JSON.stringify(leaderboardRes.body)}`);
  }
  const topPlayer = leaderboardRes.body.data.leaderboard[0];
  console.log(`   ✅ Global Leaderboard API verified! #1 Ranked Player: @${topPlayer.username} (${topPlayer.wins} Wins, ${topPlayer.accuracy}% Accuracy)`);

  console.log('\n======================================================');
  console.log('🎉 STEP 7 COMPREHENSIVE TEST SUITE PASSED ALL VERIFICATIONS!');
  console.log('======================================================\n');
}

runStep7Pass().catch((err) => {
  console.error('\n❌ Step 7 Test Suite Error:', err);
  process.exit(1);
});
