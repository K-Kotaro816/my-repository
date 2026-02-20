import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../application/interfaces/ITokenService';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export function createAuthMiddleware(tokenService: ITokenService) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: '認証が必要です' });
      return;
    }

    const token = authHeader.slice(7);
    try {
      const payload = tokenService.verify(token);
      req.userId = payload.userId;
      req.userEmail = payload.email;
      next();
    } catch {
      res.status(401).json({ message: 'トークンが無効です' });
    }
  };
}
