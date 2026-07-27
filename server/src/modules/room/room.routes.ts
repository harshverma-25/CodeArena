import { Router } from 'express';
import { roomController } from './room.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import {
  createRoomSchema,
  joinRoomSchema,
  roomCodeParamSchema,
  updateSettingsSchema,
  updateReadyStatusSchema,
} from './room.validation.js';
import { asyncHandler } from '../../utils/async-handler.js';

const router = Router();

// Protect all room routes using authenticate middleware
router.use(asyncHandler(authenticate));

// Route: POST /rooms
router.post(
  '/',
  validateRequest(createRoomSchema),
  asyncHandler((req, res) => roomController.createRoom(req, res))
);

// Route: POST /rooms/join
router.post(
  '/join',
  validateRequest(joinRoomSchema),
  asyncHandler((req, res) => roomController.joinRoom(req, res))
);

// Route: GET /rooms/:roomCode
router.get(
  '/:roomCode',
  validateRequest(roomCodeParamSchema),
  asyncHandler((req, res) => roomController.getRoom(req, res))
);

// Route: PATCH /rooms/:roomCode/settings
router.patch(
  '/:roomCode/settings',
  validateRequest(updateSettingsSchema),
  asyncHandler((req, res) => roomController.updateSettings(req, res))
);

// Route: PATCH /rooms/:roomCode/ready
router.patch(
  '/:roomCode/ready',
  validateRequest(updateReadyStatusSchema),
  asyncHandler((req, res) => roomController.updateReadyStatus(req, res))
);

// Route: POST /rooms/:roomCode/leave
router.post(
  '/:roomCode/leave',
  validateRequest(roomCodeParamSchema),
  asyncHandler((req, res) => roomController.leaveRoom(req, res))
);

// Route: DELETE /rooms/:roomCode
router.delete(
  '/:roomCode',
  validateRequest(roomCodeParamSchema),
  asyncHandler((req, res) => roomController.deleteRoom(req, res))
);

export const roomRoutes = router;
export default roomRoutes;
