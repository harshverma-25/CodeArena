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

function waitForEvent<T = any>(socket: Socket, event: string, timeoutMs = 25000): Promise<T> {
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

  const USER_1 = await createTestGuest('TimeoutHost');
  const USER_2 = await createTestGuest('TimeoutGuest');
  console.log(`✅ Created test users: ${USER_1.username}, ${USER_2.username}`);

  // 1. Create Room with timeLimit = 10s for fast timeout verification
  const createRes = await postJSON(
    '/api/v1/rooms',
    { topic: 'random', difficulty: 'random', questionCount: 10, timeLimit: 10 },
    USER_1.token
  );
  if (!createRes.success || !createRes.data) {
    throw new Error(`Failed to create room: ${JSON.stringify(createRes)}`);
  }
  const roomCode = createRes.data.roomCode;
  console.log(`✅ Room created: ${roomCode} (timeLimit: 10s)`);

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
      if (room.players.length >= 2 && room.players.every((p: any) => p.isReady)) {
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

  // 3. Start Battle
  const p1InitPromise = waitForEvent(socket1, 'battle:init');
  socket1.emit('room:start_battle', { roomCode });
  const p1Init = await p1InitPromise;
  console.log(`✅ Battle started! Q1 deadline is ${p1Init.timePerQuestion}s. Neither player will submit an answer, awaiting authoritative server timeout sweeper...`);

  // 4. Wait for server-authoritative timeout (10 seconds + sweeper cycle)
  console.log(`⏳ Waiting for server-side question timeout (approx 10s)...`);
  const timeoutRevealPromise = waitForEvent(socket1, 'battle:reveal', 20000);
  const reveal = await timeoutRevealPromise;

  console.log(`✅ Server sweeper successfully triggered question timeout!`);
  console.log(`   battle:reveal received for round ${reveal.roundIndex}`);
  console.log(`   Correct answer: index ${reveal.correctAnswer}`);
  console.log(`   Accuracy across players: ${reveal.accuracyPct}% (${reveal.correctCount}/${reveal.totalPlayers})`);

  socket1.disconnect();
  socket2.disconnect();
  console.log('\n🎉 TIMEOUT INTEGRATION TEST PASSED!\n');
}

runTimeoutTest().catch((err) => {
  console.error('\n❌ Timeout test error:', err);
  process.exit(1);
});
