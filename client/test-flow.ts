import { io, Socket } from 'socket.io-client';
import { BACKEND_URL, createTestGuest } from './test-auth-helper';

async function postJSON(url: string, data: any, token: string) {
  const res = await fetch(`${BACKEND_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
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

function waitForEvent<T = any>(socket: Socket, event: string, timeoutMs = 5000): Promise<T> {
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

async function runTest() {
  console.log('🧪 Starting Automated Live Battle Flow Integration Test...');

  const USER_1 = await createTestGuest('AliceHost');
  const USER_2 = await createTestGuest('BobChallenger');
  console.log(`✅ Dynamically authenticated test users: ${USER_1.username}, ${USER_2.username}`);

  // Step 1: Host creates room via REST
  console.log('\n1. Host creating battle room (topic: random, difficulty: random, questionCount: 10, timeLimit: 30)...');
  const createRes = await postJSON(
    '/api/v1/rooms',
    { topic: 'random', difficulty: 'random', questionCount: 10, timeLimit: 30 },
    USER_1.token
  );
  if (!createRes.success || !createRes.data) {
    throw new Error(`Failed to create room: ${JSON.stringify(createRes)}`);
  }
  const roomCode = createRes.data.roomCode;
  console.log(`✅ Room created successfully! Room code: ${roomCode}`);

  // Step 2: Connect sockets
  console.log('\n2. Connecting sockets for Host and Challenger...');
  const socket1 = await connectSocket(USER_1.token);
  const socket2 = await connectSocket(USER_2.token);
  console.log(`✅ Both sockets connected.`);

  // Step 3: Host joins room
  console.log('\n3. Host joining room channel...');
  const p1JoinPromise = waitForEvent(socket1, 'room:update');
  socket1.emit('room:join', { roomCode });
  await p1JoinPromise;
  console.log(`✅ Host joined room channel.`);

  // Step 4: Challenger joins room
  console.log('\n4. Challenger joining room channel...');
  const p2JoinPromise = waitForEvent(socket2, 'room:update');
  socket2.emit('room:join', { roomCode });
  const p2JoinRoom = await p2JoinPromise;
  console.log(`✅ Challenger joined room. Current players: ${p2JoinRoom.players.length}`);

  // Step 5: Ready Up both players
  console.log('\n5. Readying up both players...');
  const readyPromise = new Promise((resolve) => {
    const checkReady = (room: any) => {
      if (room.players.length >= 2 && room.players.every((p: any) => p.isReady)) {
        socket1.off('room:update', checkReady);
        resolve(room);
      }
    };
    socket1.on('room:update', checkReady);
  });

  socket1.emit('room:ready', { roomCode, isReady: true });
  socket2.emit('room:ready', { roomCode, isReady: true });

  const finalReadyRoom: any = await readyPromise;
  console.log(`✅ Both players ready! Players count: ${finalReadyRoom.players.length}`);

  // Step 6: Start Battle
  console.log('\n6. Host initiating battle (room:start_battle)...');
  const p1InitPromise = waitForEvent(socket1, 'battle:init');
  const p2InitPromise = waitForEvent(socket2, 'battle:init');

  socket1.emit('room:start_battle', { roomCode });

  const [p1Init, p2Init] = await Promise.all([p1InitPromise, p2InitPromise]);
  console.log(`✅ Both players received battle:init!`);
  console.log(`   Player 1 Q1: "${p1Init.currentQuestion.question}"`);
  console.log(`   Player 2 Q1: "${p2Init.currentQuestion.question}"`);
  console.log(`   Total Questions: ${p1Init.questionCount}, Time per question: ${p1Init.timePerQuestion}s`);

  // Step 7: Answer Question (Synchronized Round Lifecycle)
  console.log('\n7. Player 1 answering question 1...');
  const p1LockedPromise = waitForEvent(socket1, 'battle:answer_locked');
  const p2SubmittedPromise = waitForEvent(socket2, 'battle:player_submitted');

  socket1.emit('battle:submit_answer', {
    roomCode,
    questionId: p1Init.currentQuestion.questionId,
    selectedOption: 0,
  });

  const [p1Locked, p2Submitted] = await Promise.all([p1LockedPromise, p2SubmittedPromise]);
  console.log(`✅ Player 1 answer locked (potential score: ${p1Locked.potentialScore}, time: ${p1Locked.timeTakenMs}ms)`);
  console.log(`✅ Player 2 received opponent submission notification (userId: ${p2Submitted.userId})`);

  // Player 2 answers question 1 -> all players answered, server triggers round reveal
  console.log('\n7b. Player 2 answering question 1 (all players answered -> round reveal)...');
  const p1RevealPromise = waitForEvent(socket1, 'battle:reveal');
  const p2RevealPromise = waitForEvent(socket2, 'battle:reveal');

  socket2.emit('battle:submit_answer', {
    roomCode,
    questionId: p2Init.currentQuestion.questionId,
    selectedOption: 0,
  });

  const [p1Reveal, p2Reveal] = await Promise.all([p1RevealPromise, p2RevealPromise]);
  console.log(`✅ Both players received battle:reveal! Correct answer index: ${p1Reveal.correctAnswer}`);

  // Step 8: Reconnection test
  console.log('\n8. Testing reconnection during battle (battle:reconnect)...');
  const reconnectPromise = waitForEvent(socket1, 'battle:init');
  socket1.emit('battle:reconnect', { roomCode });
  const reconnectedState = await reconnectPromise;
  console.log(`✅ Reconnection succeeded! Recovered current question: "${reconnectedState.currentQuestion.question.slice(0, 35)}..."`);

  // Cleanup
  socket1.disconnect();
  socket2.disconnect();

  console.log('\n🏆 ALL BATTLE FLOW INTEGRATION TESTS PASSED PERFECTLY!\n');
}

runTest().catch((err) => {
  console.error('\n❌ Integration test failed:', err);
  process.exit(1);
});
