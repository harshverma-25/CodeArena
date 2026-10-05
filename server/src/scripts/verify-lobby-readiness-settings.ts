import { io as ClientSocket, Socket as ClientSocketType } from '../../../client/node_modules/socket.io-client/build/esm/index.js';
import http from 'http';
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

import { registerRoomHandlers } from '../sockets/room.socket.js';
import { roomService } from '../modules/room/room.service.js';
import { battleService } from '../modules/battle/battle.service.js';
import { UserModel } from '../modules/user/user.model.js';
import { QuestionModel } from '../modules/question/question.model.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = 4099;

function waitForEvent<T = any>(socket: ClientSocketType, event: string, timeoutMs = 5000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event '${event}' after ${timeoutMs}ms`));
    }, timeoutMs);

    socket.once(event, (data: T) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

async function run() {
  console.log('--- STARTING LOBBY READINESS & HOST SETTINGS SOCKET VERIFICATION ---');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena_test';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB.');

  // Set up mock HTTP + Socket.IO server
  const app = express();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: '*' },
  });

  // Mock socket auth middleware using user ID in handshake
  io.use((socket, next) => {
    const userId = socket.handshake.auth?.userId;
    if (!userId) return next(new Error('Unauthorized'));
    socket.data.user = { _id: new mongoose.Types.ObjectId(userId) };
    next();
  });

  io.on('connection', (socket) => {
    registerRoomHandlers(io, socket);
  });

  await new Promise<void>((resolve) => server.listen(PORT, () => resolve()));
  console.log(`✅ Test Socket server running on port ${PORT}`);

  try {
    // 1. Create Host User and Guest/Player 2 User in DB
    const hostUser = await UserModel.create({
      username: `host_${Date.now()}`,
      email: `host_${Date.now()}@example.com`,
      displayName: 'Host User',
    });

    const player2User = await UserModel.create({
      username: `player2_${Date.now()}`,
      email: `player2_${Date.now()}@example.com`,
      displayName: 'Player Two',
    });

    console.log(`Created Host: ${hostUser.username} (${hostUser._id})`);
    console.log(`Created Player 2: ${player2User.username} (${player2User._id})`);

    // 2. Create room hosted by hostUser
    const room = await roomService.createRoom(hostUser._id.toString(), {
      categoryId: 'programming',
      subjectId: 'dsa',
      questionCount: 10,
    });
    const roomCode = room.roomCode;
    console.log(`✅ Room created: ${roomCode}, HostId: ${room.hostId}`);

    // Add Player 2 to room
    await roomService.joinRoom(player2User._id.toString(), roomCode);
    console.log(`✅ Player 2 joined room ${roomCode}`);

    // 3. Connect Host and Player 2 Client Sockets
    const hostSocket = ClientSocket(`http://localhost:${PORT}`, {
      auth: { userId: hostUser._id.toString() },
      transports: ['websocket'],
    });

    const p2Socket = ClientSocket(`http://localhost:${PORT}`, {
      auth: { userId: player2User._id.toString() },
      transports: ['websocket'],
    });

    await waitForEvent(hostSocket, 'connect');
    await waitForEvent(p2Socket, 'connect');
    console.log('✅ Both sockets connected to test server.');

    // Join room channel
    const hostJoinPromise = waitForEvent(hostSocket, 'room:update');
    hostSocket.emit('room:join', { roomCode });
    await hostJoinPromise;

    const p2JoinPromise = waitForEvent(p2Socket, 'room:update');
    p2Socket.emit('room:join', { roomCode });
    const p2RoomState = await p2JoinPromise;
    console.log('✅ Both sockets joined room channel.');

    // Verification 1: Initial readiness
    const initialP2 = p2RoomState.players.find((p: any) => p.userId === player2User._id.toString());
    if (initialP2?.isReady !== false) {
      throw new Error(`Expected Player 2 initial readiness to be false, got ${initialP2?.isReady}`);
    }
    console.log('✅ Checkpoint 1: Initial readiness is false.');

    // Verification 2: Host cannot start battle while Player 2 is NOT ready
    let hostStartBlocked = false;
    try {
      await battleService.startBattle(hostUser._id.toString(), roomCode);
    } catch (err: any) {
      if (err.message.includes('All players must be ready')) {
        hostStartBlocked = true;
      }
    }
    if (!hostStartBlocked) {
      throw new Error('Expected host battle start to fail when Player 2 is not ready');
    }
    console.log('✅ Checkpoint 2: Host is blocked from starting battle until non-host is ready.');

    // Verification 3: Player 2 toggles ready (false -> true)
    const p2ReadyBroadcastPromise = waitForEvent(hostSocket, 'room:update');
    p2Socket.emit('room:ready', { roomCode, isReady: true });
    const updatedState1 = await p2ReadyBroadcastPromise;
    const p2AfterReady = updatedState1.players.find((p: any) => p.userId === player2User._id.toString());
    if (p2AfterReady?.isReady !== true) {
      throw new Error(`Expected Player 2 isReady to be true, got ${p2AfterReady?.isReady}`);
    }
    console.log('✅ Checkpoint 3: Player 2 set isReady = true and host received room:update broadcast.');

    // Verification 4: Player 2 toggles not ready (true -> false)
    const p2UnreadyBroadcastPromise = waitForEvent(hostSocket, 'room:update');
    p2Socket.emit('room:ready', { roomCode, isReady: false });
    const updatedState2 = await p2UnreadyBroadcastPromise;
    const p2AfterUnready = updatedState2.players.find((p: any) => p.userId === player2User._id.toString());
    if (p2AfterUnready?.isReady !== false) {
      throw new Error(`Expected Player 2 isReady to be false, got ${p2AfterUnready?.isReady}`);
    }
    console.log('✅ Checkpoint 4: Player 2 set isReady = false and host received room:update broadcast.');

    // Verification 5: Non-host attempts to update settings via room:update_settings -> REJECTED
    const p2ErrorPromise = waitForEvent(p2Socket, 'error');
    p2Socket.emit('room:update_settings', {
      roomCode,
      settings: { questionCount: 20 },
    });
    const p2Error = await p2ErrorPromise;
    if (!p2Error.message?.includes('Only the host can update room settings')) {
      throw new Error(`Expected error rejecting non-host settings update, got: ${JSON.stringify(p2Error)}`);
    }
    console.log('✅ Checkpoint 5: Non-host client rejected from updating room settings via room:update_settings.');

    // Verification 6: Host updates settings via room:update_settings -> BROADCAST to all players
    const hostUpdateBroadcastForP2 = waitForEvent(p2Socket, 'room:update');
    hostSocket.emit('room:update_settings', {
      roomCode,
      settings: {
        categoryId: 'programming',
        isMixedCategory: true,
        questionCount: 15,
      },
    });
    const p2ReceivedRoom = await hostUpdateBroadcastForP2;
    if (p2ReceivedRoom.settings.isMixedCategory !== true) {
      throw new Error(`Expected isMixedCategory = true, got ${p2ReceivedRoom.settings.isMixedCategory}`);
    }
    if (p2ReceivedRoom.settings.questionCount !== 15) {
      throw new Error(`Expected questionCount = 15, got ${p2ReceivedRoom.settings.questionCount}`);
    }
    if (p2ReceivedRoom.settings.timeLimit !== 30) {
      throw new Error(`Expected server-derived timeLimit = 30, got ${p2ReceivedRoom.settings.timeLimit}`);
    }
    console.log('✅ Checkpoint 6: Host successfully updated settings via room:update_settings; Player 2 received synchronized room:update with server-derived timer.');

    // Verification 7: Disconnect resets player ready state
    // First, set P2 to ready again
    const p2ReadyAgainPromise = waitForEvent(hostSocket, 'room:update');
    p2Socket.emit('room:ready', { roomCode, isReady: true });
    await p2ReadyAgainPromise;

    // Now disconnect P2 socket
    const hostSeeDisconnectReset = waitForEvent(hostSocket, 'room:update');
    p2Socket.disconnect();
    const stateAfterDisconnect = await hostSeeDisconnectReset;
    const p2AfterDisc = stateAfterDisconnect.players.find((p: any) => p.userId === player2User._id.toString());
    if (p2AfterDisc?.isReady !== false) {
      throw new Error(`Expected disconnected player isReady to reset to false, got ${p2AfterDisc?.isReady}`);
    }
    console.log('✅ Checkpoint 7: Disconnected player readiness automatically resets to false and broadcasts room:update.');

    // Clean up sockets
    hostSocket.disconnect();

    console.log('\n==================================================');
    console.log('🎉 ALL 7 LOBBY READINESS & HOST SETTINGS CHECKPOINTS PASSED!');
    console.log('==================================================');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

run().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
