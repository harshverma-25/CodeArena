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

function waitForEvent<T = any>(socket: Socket, event: string, timeoutMs = 45000): Promise<T> {
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

async function runTimeoutTest() {
  console.log('⏰ Starting Question Timeout Server Handling Test...');

  // 1. Create Room
  const createRes = await postJSON(
    '/api/v1/rooms',
    { topic: 'random', difficulty: 'random', questionCount: 10, duration: 30 },
    USER_1.token
  );
  const roomCode = createRes.data.roomCode;
  console.log(`✅ Room created: ${roomCode}`);

  const socket1 = await connectSocket(USER_1.token);
  const socket2 = await connectSocket(USER_2.token);

  // 2. Join & Ready
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

  // 3. Start Battle
  const p1InitPromise = waitForEvent(socket1, 'battle:init');
  socket1.emit('room:start_battle', { roomCode });
  const p1Init = await p1InitPromise;
  console.log(`✅ Battle started! Q1 deadline is ${p1Init.timePerQuestion}s. We will NOT submit an answer and wait for server timeout...`);

  // 4. Wait for server-authoritative timeout (30 seconds)
  console.log('⏳ Waiting for server-side question timeout (approx 30s)...');
  const timeoutNextPromise = waitForEvent(socket1, 'battle:next_question', 35000);
  const nextQ = await timeoutNextPromise;

  console.log(`✅ Server successfully triggered question timeout!`);
  console.log(`   Player automatically advanced to Q index ${nextQ.currentQuestionIndex}`);
  console.log(`   Next question: "${nextQ.question.question.slice(0, 40)}..."`);

  socket1.disconnect();
  socket2.disconnect();
  console.log('\n🎉 TIMEOUT INTEGRATION TEST PASSED!\n');
}

runTimeoutTest().catch((err) => {
  console.error('\n❌ Timeout test error:', err);
  process.exit(1);
});
