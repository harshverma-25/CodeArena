import { io, Socket } from 'socket.io-client';
import { createTestGuest, BACKEND_URL } from './test-auth-helper.js';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForEvent<T = any>(socket: Socket, event: string, timeoutMs = 8000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event "${event}" after ${timeoutMs}ms`));
    }, timeoutMs);

    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

async function runRegressionSuite() {
  console.log('====================================================');
  console.log('🚀 RUNNING QUIZZY QUESTION ID & SUBMISSION REGRESSION SUITE');
  console.log('====================================================\n');

  // -------------------------------------------------------------------------
  // Scenario 1: Starting a solo quiz and answering the first question
  // -------------------------------------------------------------------------
  console.log('--- Test 1: Starting solo quiz & answering first question ---');
  const user1 = await createTestGuest('SoloPlayer1');
  const soloRes = await fetch(`${BACKEND_URL}/api/v1/rooms/solo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user1.token}`,
    },
    body: JSON.stringify({
      categoryId: 'general-knowledge',
      isMixedCategory: true,
      questionCount: 10,
    }),
  });
  const soloData = await soloRes.json();
  if (!soloData.success) throw new Error('Failed to create solo room: ' + JSON.stringify(soloData));
  const roomCode1 = soloData.data.roomCode;
  console.log(`Created Solo Room: ${roomCode1}`);

  const socket1 = io(BACKEND_URL, {
    auth: { token: user1.token },
    transports: ['websocket'],
  });
  await waitForEvent(socket1, 'connect');
  console.log('Socket 1 connected.');

  // Emit battle:reconnect
  socket1.emit('battle:reconnect', { roomCode: roomCode1 });
  const init1 = await waitForEvent(socket1, 'battle:init');
  console.log(`Received battle:init for Round 0: questionId=${init1.currentQuestion?.questionId}`);

  // Answer first question
  const revealPromise = waitForEvent(socket1, 'battle:reveal');
  socket1.emit('battle:submit_answer', {
    roomCode: roomCode1,
    questionId: init1.currentQuestion.questionId,
    selectedOption: 0,
  });
  const locked1 = await waitForEvent(socket1, 'battle:answer_locked');
  console.log('✅ Answer 1 locked successfully:', locked1);

  // -------------------------------------------------------------------------
  // Scenario 3: Submitting twice for the same question (Idempotency)
  // -------------------------------------------------------------------------
  console.log('\n--- Test 3: Submitting twice for the same question (Idempotency) ---');
  socket1.emit('battle:submit_answer', {
    roomCode: roomCode1,
    questionId: init1.currentQuestion.questionId,
    selectedOption: 0,
  });
  const locked1Duplicate = await waitForEvent(socket1, 'battle:answer_locked');
  console.log('✅ Duplicate answer locked idempotently without error:', locked1Duplicate);

  // -------------------------------------------------------------------------
  // Scenario 2: Answering successive questions
  // -------------------------------------------------------------------------
  console.log('\n--- Test 2: Answering successive questions ---');
  // Wait for reveal
  const reveal1 = await revealPromise;
  console.log(`Received battle:reveal for round ${reveal1.roundIndex}, correct answer: ${reveal1.correctAnswer}`);

  // In solo mode, host can advance round early or wait
  socket1.emit('battle:advance_round', { roomCode: roomCode1 });
  const nextQ = await waitForEvent(socket1, 'battle:next_question');
  console.log(`Received battle:next_question for Round 1: questionId=${nextQ.question?.questionId}`);

  // Answer second question
  socket1.emit('battle:submit_answer', {
    roomCode: roomCode1,
    questionId: nextQ.question.questionId,
    selectedOption: 1,
  });
  const locked2 = await waitForEvent(socket1, 'battle:answer_locked');
  console.log('✅ Round 1 answer locked successfully:', locked2);

  // -------------------------------------------------------------------------
  // Scenario 5: Reconnecting or refreshing during a question
  // -------------------------------------------------------------------------
  console.log('\n--- Test 5: Reconnecting / refreshing during a question ---');
  // Disconnect socket1
  socket1.disconnect();
  console.log('Simulating page refresh / socket disconnect...');
  await delay(1000);

  // Create new socket for user1
  const socket1Reconnected = io(BACKEND_URL, {
    auth: { token: user1.token },
    transports: ['websocket'],
  });
  await waitForEvent(socket1Reconnected, 'connect');
  socket1Reconnected.emit('battle:reconnect', { roomCode: roomCode1 });
  const initReconnected = await waitForEvent(socket1Reconnected, 'battle:init');
  console.log(`✅ Reconnection succeeded. Received battle:init for current round ${initReconnected.currentQuestionIndex}`);
  socket1Reconnected.disconnect();

  // -------------------------------------------------------------------------
  // Scenario 7: Verifying client cannot submit a different question's ID
  // -------------------------------------------------------------------------
  console.log("\n--- Test 7: Anti-cheat: Submitting a forged / different question's ID ---");
  const userCheat = await createTestGuest('CheatTester');
  const soloCheatRes = await fetch(`${BACKEND_URL}/api/v1/rooms/solo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userCheat.token}`,
    },
    body: JSON.stringify({
      categoryId: 'general-knowledge',
      isMixedCategory: true,
      questionCount: 10,
    }),
  });
  const soloCheatData = await soloCheatRes.json();
  const cheatRoom = soloCheatData.data.roomCode;

  const cheatSocket = io(BACKEND_URL, {
    auth: { token: userCheat.token },
    transports: ['websocket'],
  });
  await waitForEvent(cheatSocket, 'connect');
  cheatSocket.emit('battle:reconnect', { roomCode: cheatRoom });
  const cheatInit = await waitForEvent(cheatSocket, 'battle:init');

  // Submit completely invalid / forged question ID
  cheatSocket.emit('battle:submit_answer', {
    roomCode: cheatRoom,
    questionId: 'forged-fake-question-999',
    selectedOption: 2,
  });

  const rejectedEvent: any = await new Promise((resolve) => {
    cheatSocket.once('battle:submit_rejected', (p) => resolve({ type: 'rejected', p }));
    cheatSocket.once('error', (err) => resolve({ type: 'error', err }));
    cheatSocket.once('battle:answer_locked', (l) => resolve({ type: 'locked', l }));
  });

  if (rejectedEvent.type === 'locked') {
    throw new Error('FAILED: Server accepted forged question ID!');
  }
  console.log('✅ Forged question ID correctly rejected:', rejectedEvent);
  cheatSocket.disconnect();

  // -------------------------------------------------------------------------
  // Scenario 6: Two players answering the same multiplayer question
  // -------------------------------------------------------------------------
  console.log('\n--- Test 6: Two players in multiplayer room ---');
  const host = await createTestGuest('MultiHost');
  const guest = await createTestGuest('MultiGuest');

  // Host creates room
  const createRoomRes = await fetch(`${BACKEND_URL}/api/v1/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${host.token}`,
    },
    body: JSON.stringify({
      categoryId: 'general-knowledge',
      isMixedCategory: true,
      questionCount: 10,
    }),
  });
  const roomData = await createRoomRes.json();
  const multiRoomCode = roomData.data.roomCode;
  console.log(`Created Multiplayer Room: ${multiRoomCode}`);

  // Guest joins room
  const joinRes = await fetch(`${BACKEND_URL}/api/v1/rooms/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${guest.token}`,
    },
    body: JSON.stringify({ roomCode: multiRoomCode }),
  });
  const joinData = await joinRes.json();
  if (!joinData.success) throw new Error('Guest failed to join room');

  // Connect sockets
  const hostSocket = io(BACKEND_URL, { auth: { token: host.token }, transports: ['websocket'] });
  const guestSocket = io(BACKEND_URL, { auth: { token: guest.token }, transports: ['websocket'] });
  await Promise.all([waitForEvent(hostSocket, 'connect'), waitForEvent(guestSocket, 'connect')]);

  hostSocket.emit('room:join', { roomCode: multiRoomCode });
  guestSocket.emit('room:join', { roomCode: multiRoomCode });
  await delay(500);

  // Guest sets ready
  guestSocket.emit('room:ready', { roomCode: multiRoomCode, isReady: true });
  await delay(500);

  // Host starts battle
  hostSocket.emit('room:start_battle', { roomCode: multiRoomCode });

  const [hostInit, guestInit] = await Promise.all([
    waitForEvent(hostSocket, 'battle:init'),
    waitForEvent(guestSocket, 'battle:init'),
  ]);
  console.log(`Multiplayer started. Host Q0: ${hostInit.currentQuestion?.questionId}, Guest Q0: ${guestInit.currentQuestion?.questionId}`);

  if (hostInit.currentQuestion?.questionId !== guestInit.currentQuestion?.questionId) {
    throw new Error('Both players should receive the same question ID!');
  }

  // Host answers
  const guestSubmittedPromise = waitForEvent(guestSocket, 'battle:player_submitted');
  hostSocket.emit('battle:submit_answer', {
    roomCode: multiRoomCode,
    questionId: hostInit.currentQuestion.questionId,
    selectedOption: 0,
  });
  const hostLocked = await waitForEvent(hostSocket, 'battle:answer_locked');
  console.log('Host answer locked:', hostLocked);

  // Guest receives battle:player_submitted notification
  const guestSawHostSubmit = await guestSubmittedPromise;
  console.log('Guest notified of host submission:', guestSawHostSubmit.userId);

  // Guest answers
  const hostRevealPromise = waitForEvent(hostSocket, 'battle:reveal');
  const guestRevealPromise = waitForEvent(guestSocket, 'battle:reveal');
  guestSocket.emit('battle:submit_answer', {
    roomCode: multiRoomCode,
    questionId: guestInit.currentQuestion.questionId,
    selectedOption: 1,
  });
  const guestLocked = await waitForEvent(guestSocket, 'battle:answer_locked');
  console.log('Guest answer locked:', guestLocked);

  // Both should receive synchronized battle:reveal
  const [hostReveal, guestReveal] = await Promise.all([
    hostRevealPromise,
    guestRevealPromise,
  ]);
  console.log('✅ Both players received synchronized battle:reveal:', {
    roundIndex: hostReveal.roundIndex,
    correctAnswer: hostReveal.correctAnswer,
    playersCount: hostReveal.players.length,
  });

  hostSocket.disconnect();
  guestSocket.disconnect();

  // -------------------------------------------------------------------------
  // Scenario 4: Submitting an answer after the timer expires
  // -------------------------------------------------------------------------
  console.log('\n--- Test 4: Submitting an answer after timer expires ---');
  const userLate = await createTestGuest('LatePlayer');
  const soloLateRes = await fetch(`${BACKEND_URL}/api/v1/rooms/solo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userLate.token}`,
    },
    body: JSON.stringify({
      categoryId: 'general-knowledge',
      isMixedCategory: true,
      questionCount: 10,
    }),
  });
  const lateData = await soloLateRes.json();
  const lateRoom = lateData.data.roomCode;

  const lateSocket = io(BACKEND_URL, { auth: { token: userLate.token }, transports: ['websocket'] });
  await waitForEvent(lateSocket, 'connect');
  lateSocket.emit('battle:reconnect', { roomCode: lateRoom });
  const lateInit = await waitForEvent(lateSocket, 'battle:init');
  const originalQId = lateInit.currentQuestion.questionId;
  console.log(`Late player round 0 questionId: ${originalQId}`);

  // Intentionally advance round so original question becomes stale
  // (simulate timer expiration and turn advancement)
  // Advance by calling advanceToNextRound via socket or waiting
  lateSocket.emit('battle:advance_round', { roomCode: lateRoom });
  // If not in reveal, host advance acknowledged is false
  // Submit an answer to reveal, then advance
  const lateRevealPromise = waitForEvent(lateSocket, 'battle:reveal');
  lateSocket.emit('battle:submit_answer', {
    roomCode: lateRoom,
    questionId: originalQId,
    selectedOption: 0,
  });
  await waitForEvent(lateSocket, 'battle:answer_locked');
  await lateRevealPromise;

  // Advance to Round 1
  lateSocket.emit('battle:advance_round', { roomCode: lateRoom });
  const round1Data = await waitForEvent(lateSocket, 'battle:next_question');
  console.log(`Advanced to Round 1 (questionId: ${round1Data.question.questionId})`);

  // Now submit the STALE Question 0 ID
  console.log(`Submitting stale Question 0 ID (${originalQId}) during Round 1...`);
  lateSocket.emit('battle:submit_answer', {
    roomCode: lateRoom,
    questionId: originalQId,
    selectedOption: 2,
  });

  const lateRejectResult: any = await new Promise((resolve) => {
    lateSocket.once('battle:submit_rejected', (p) => resolve({ type: 'rejected', p }));
    lateSocket.once('error', (err) => resolve({ type: 'error', err }));
    lateSocket.once('battle:answer_locked', (l) => resolve({ type: 'locked', l }));
  });

  console.log('✅ Late submission handled with structured rejection:', lateRejectResult);
  if (lateRejectResult.type !== 'rejected') {
    throw new Error('Expected structured battle:submit_rejected event');
  }
  lateSocket.disconnect();

  console.log('\n====================================================');
  console.log('🎉 ALL 7 REGRESSION TEST SCENARIOS PASSED SUCCESSFULLY!');
  console.log('====================================================');
}

runRegressionSuite().catch((err) => {
  console.error('❌ Regression suite failed:', err);
  process.exit(1);
});
