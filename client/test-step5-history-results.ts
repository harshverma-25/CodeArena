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

async function runStep5Test() {
  console.log('🚀 Starting Step 5 Automated Integration Test...\n');

  // Step 1: Create room & complete a live battle
  console.log('1. Creating battle room...');
  const createRes = await postJSON(
    '/api/v1/rooms',
    { topic: 'JavaScript', difficulty: 'Easy', questionCount: 5, duration: 30 },
    USER_1.token
  );
  if (createRes.status !== 201 && createRes.status !== 200) {
    throw new Error(`Failed to create room: ${JSON.stringify(createRes.body)}`);
  }
  const roomCode = createRes.body.data.roomCode;
  console.log(`   Room created: ${roomCode}`);

  const socket1 = await connectSocket(USER_1.token);
  const socket2 = await connectSocket(USER_2.token);
  const socket3 = await connectSocket(USER_UNAUTHORIZED.token);

  // Join & Ready
  const p1Join = waitForEvent(socket1, 'room:update');
  socket1.emit('room:join', { roomCode });
  await p1Join;

  const p2Join = waitForEvent(socket2, 'room:update');
  socket2.emit('room:join', { roomCode });
  await p2Join;

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

  // Start Battle & Verify Anti-Cheat in Live Payloads
  console.log('2. Starting battle and checking live payload anti-cheat protection...');
  const p1InitPromise = waitForEvent(socket1, 'battle:init');
  const p2InitPromise = waitForEvent(socket2, 'battle:init');
  socket1.emit('room:start_battle', { roomCode });
  const [p1Init, p2Init] = await Promise.all([p1InitPromise, p2InitPromise]);

  const liveQuestion = p1Init.currentQuestion;
  console.log('   Inspecting live question payload:');
  console.log(`   - questionId: ${liveQuestion.questionId}`);
  console.log(`   - correctAnswer exposed? ${'correctAnswer' in liveQuestion ? 'YES (FAIL!)' : 'NO (PROTECTED)'}`);
  console.log(`   - explanation exposed? ${'explanation' in liveQuestion ? 'YES (FAIL!)' : 'NO (PROTECTED)'}`);

  if ('correctAnswer' in liveQuestion || 'explanation' in liveQuestion) {
    throw new Error('❌ ANTI-CHEAT FAILURE: Live battle payload exposed answer/explanation!');
  }
  console.log('   ✅ Live battle payloads are strictly sanitized!');

  // Set up completion listeners
  const p1CompletedPromise = waitForEvent(socket1, 'battle:completed', 30000);
  const p2CompletedPromise = waitForEvent(socket2, 'battle:completed', 30000);

  // Submit answers for Player 1
  let p1Q = p1Init.currentQuestion;
  for (let i = 0; i < p1Init.questionCount; i++) {
    const nextPromise = waitForEvent(socket1, 'battle:next_question');
    socket1.emit('battle:submit_answer', {
      roomCode,
      questionId: p1Q.questionId,
      selectedOption: 0,
    });
    const nextPayload = await nextPromise;
    p1Q = nextPayload.question;
  }

  // Submit answers for Player 2
  let p2Q = p2Init.currentQuestion;
  for (let i = 0; i < p2Init.questionCount; i++) {
    const nextPromise = waitForEvent(socket2, 'battle:next_question');
    socket2.emit('battle:submit_answer', {
      roomCode,
      questionId: p2Q.questionId,
      selectedOption: 0,
    });
    const nextPayload = await nextPromise;
    p2Q = nextPayload.question;
  }

  const [completedPayload] = await Promise.all([p1CompletedPromise, p2CompletedPromise]);
  const battleId = completedPayload.battleId;
  console.log(`   ✅ Battle completed! Battle ID: ${battleId}`);

  socket1.disconnect();
  socket2.disconnect();
  socket3.disconnect();

  // Step 3: Test Battle Results API Endpoint for Authorized Participant
  console.log('\n3. Testing GET /api/v1/history/battles/:battleId as Authorized Participant (User 1)...');
  const resultsRes = await getJSON(`/api/v1/history/battles/${battleId}`, USER_1.token);
  console.log(`   Response status: ${resultsRes.status}`);

  if (resultsRes.status !== 200 || !resultsRes.body.success) {
    throw new Error(`Failed to fetch battle results: ${JSON.stringify(resultsRes.body)}`);
  }

  const resultsData = resultsRes.body.data;
  console.log(`   - Battle Status: ${resultsData.status}`);
  console.log(`   - Topic: ${resultsData.topic}, Difficulty: ${resultsData.difficulty}`);
  console.log(`   - Result Outcome: ${resultsData.result}`);
  console.log(`   - Duration: ${resultsData.duration}s`);
  console.log(`   - User Player Correct: ${resultsData.userPlayer.correctCount}, Incorrect: ${resultsData.userPlayer.incorrectCount}, Unanswered: ${resultsData.userPlayer.unansweredCount}`);

  const sampleQ = resultsData.userPlayer.questions[0];
  console.log('\n   Inspecting Completed Battle Question Review details:');
  console.log(`   - Question Text: "${sampleQ.question}"`);
  console.log(`   - 4 Options: [${sampleQ.options.join(', ')}]`);
  console.log(`   - Correct Answer Index: ${sampleQ.correctAnswer}`);
  console.log(`   - Explanation: "${sampleQ.explanation}"`);
  console.log(`   - Selected Option: ${sampleQ.selectedOption}`);
  console.log(`   - Is Correct: ${sampleQ.isCorrect}`);
  console.log(`   - Time Taken Ms: ${sampleQ.timeTakenMs}ms`);

  if (
    sampleQ.correctAnswer === undefined ||
    sampleQ.explanation === undefined ||
    !sampleQ.question ||
    sampleQ.options.length !== 4
  ) {
    throw new Error('❌ Battle Results payload incomplete or missing correct answer/explanation!');
  }
  console.log('   ✅ Battle Results API correctly provides full questions, correct answers, and explanations post-battle!');

  // Step 4: Test Unauthorized Access Control
  console.log('\n4. Testing GET /api/v1/history/battles/:battleId as Unauthorized User (User 3)...');
  const unauthRes = await getJSON(`/api/v1/history/battles/${battleId}`, USER_UNAUTHORIZED.token);
  console.log(`   Response status: ${unauthRes.status}`);
  console.log(`   Response message: "${unauthRes.body.message}"`);

  if (unauthRes.status !== 403) {
    throw new Error(`❌ Security failure: Unauthorized user got status ${unauthRes.status} instead of 403 Forbidden!`);
  }
  console.log('   ✅ Unauthorized access correctly blocked with 403 Forbidden!');

  // Step 5: Test Match History API Endpoint
  console.log('\n5. Testing GET /api/v1/history (Match History Endpoint)...');
  const historyRes = await getJSON('/api/v1/history?page=1&limit=10', USER_1.token);
  console.log(`   Response status: ${historyRes.status}`);

  if (historyRes.status !== 200 || !historyRes.body.success) {
    throw new Error(`Failed to fetch match history: ${JSON.stringify(historyRes.body)}`);
  }

  const historyData = historyRes.body.data;
  console.log(`   - Total Matches Returned: ${historyData.total}`);
  console.log(`   - Page: ${historyData.page}, Limit: ${historyData.limit}`);
  
  const latestMatch = historyData.matches[0];
  console.log('   Latest Battle Log Item:');
  console.log(`   - Battle ID: ${latestMatch._id}`);
  console.log(`   - Opponent: ${latestMatch.opponent?.username || 'Guest'}`);
  console.log(`   - Topic: ${latestMatch.topic}, Difficulty: ${latestMatch.difficulty}`);
  console.log(`   - User Score vs Opponent Score: ${latestMatch.userScore} - ${latestMatch.opponentScore}`);
  console.log(`   - Outcome Result: ${latestMatch.result}`);
  console.log(`   - Date: ${latestMatch.startedAt}`);

  if (!latestMatch || latestMatch._id !== battleId) {
    throw new Error('❌ Match History does not contain the newly completed battle!');
  }
  console.log('   ✅ Match History API functioning perfectly!');

  console.log('\n======================================================');
  console.log('🎉 ALL STEP 5 REQUIREMENTS VERIFIED AND PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

runStep5Test().catch((err) => {
  console.error('\n❌ Integration Test Error:', err);
  process.exit(1);
});
