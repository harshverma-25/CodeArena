import { IUserDocument } from '../modules/user/user.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      auth?: {
        userId: string | null;
        sessionId: string | null;
        getToken: (options?: any) => Promise<string | null>;
      };
    }
  }
}
