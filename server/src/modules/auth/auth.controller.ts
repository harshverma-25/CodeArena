import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';

export class AuthController {
  /**
   * POST /api/v1/auth/guest
   * Creates an ephemeral guest account and returns a securely signed 24h JWT.
   */
  async createGuest(req: Request, res: Response): Promise<void> {
    const displayName = req.body?.displayName;
    const session = await authService.createGuestSession(displayName);

    res.status(201).json(
      new ApiResponse(201, session, 'Guest session created successfully.')
    );
  }
}

export const authController = new AuthController();
export default authController;
