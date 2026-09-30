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

async function runFullGameTest() {
  console.log('🎮 Starting End-to-End Full Battle Match Test (Answer all + Complete Battle)...');

  // 1. Create Room (questionCount: 10, total in DB = 18, so each gets 9 questions)
  const createRes = await postJSON(
    '/api/v1/rooms',
    { topic: 'random', difficulty: 'random', questionCount: 10, duration: 30 },
    USER_1.token
  );
  const roomCode = createRes.data.roomCode;
  console.log(`✅ Room created: ${roomCode}`);

  const socket1 = await connectSocket(USER_1.token);
  const socket2 = await connectSocket(USER_2.token);

  // 2. Join
  const p1Join = waitForEvent(socket1, 'room:update');
  socket1.emit('room:join', { roomCode });
  await p1Join;

  const p2Join = waitForEvent(socket2, 'room:update');
  socket2.emit('room:join', { roomCode });
  await p2Join;

  // 3. Ready
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
  console.log(`✅ Both players ready.`);

  // 4. Start
  const p1InitPromise = waitForEvent(socket1, 'battle:init');
  const p2InitPromise = waitForEvent(socket2, 'battle:init');
  socket1.emit('room:start_battle', { roomCode });
  const [p1Init, p2Init] = await Promise.all([p1InitPromise, p2InitPromise]);
  console.log(`✅ Battle started! Question count per player: ${p1Init.questionCount}`);

  // Set up listeners for battle:completed
  const p1CompletedPromise = waitForEvent(socket1, 'battle:completed', 30000);
  const p2CompletedPromise = waitForEvent(socket2, 'battle:completed', 30000);

  // 5. Player 1 answers all questions
  let p1CurrentQ = p1Init.currentQuestion;
  for (let q = 0; q < p1Init.questionCount; q++) {
    const nextPromise = waitForEvent(socket1, 'battle:next_question');
    socket1.emit('battle:submit_answer', {
      roomCode,
      questionId: p1CurrentQ.questionId,
      selectedOption: q % 4, // vary options
    });
    const nextPayload = await nextPromise;
    console.log(`  P1 answered Q${q + 1} -> ${nextPayload.completed ? 'FINISHED' : `Next Q index ${nextPayload.currentQuestionIndex}`}`);
    p1CurrentQ = nextPayload.question;
  }

  // 6. Player 2 answers all questions
  let p2CurrentQ = p2Init.currentQuestion;
  for (let q = 0; q < p2Init.questionCount; q++) {
    const nextPromise = waitForEvent(socket2, 'battle:next_question');
    socket2.emit('battle:submit_answer', {
      roomCode,
      questionId: p2CurrentQ.questionId,
      selectedOption: (q + 1) % 4,
    });
    const nextPayload = await nextPromise;
    console.log(`  P2 answered Q${q + 1} -> ${nextPayload.completed ? 'FINISHED' : `Next Q index ${nextPayload.currentQuestionIndex}`}`);
    p2CurrentQ = nextPayload.question;
  }

  // 7. Await battle:completed broadcast on both sockets
  console.log('7. Awaiting final battle:completed broadcast on both sockets...');
  const [results1, results2] = await Promise.all([p1CompletedPromise, p2CompletedPromise]);

  console.log(`\n🏆 BATTLE COMPLETED SUCCESSFULLY!`);
  console.log(`   Winner ID: ${results1.winnerId || 'Draw'}`);
  console.log(`   Is Draw: ${results1.isDraw}`);
  console.log(`   Player 1 Score: ${results1.players[0].score}/${results1.players[0].totalQuestions}`);
  console.log(`   Player 2 Score: ${results1.players[1].score}/${results1.players[1].totalQuestions}`);

  socket1.disconnect();
  socket2.disconnect();
  console.log('\n🎉 FULL MATCH LIFECYCLE TEST COMPLETED!\n');
}

runFullGameTest().catch((err) => {
  console.error('\n❌ Full game test error:', err);
  process.exit(1);
});
