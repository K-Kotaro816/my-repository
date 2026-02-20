import { Request, Response, NextFunction } from 'express';
import { RegisterUser } from '../../application/usecases/RegisterUser';
import { LoginUser } from '../../application/usecases/LoginUser';
import { GetCurrentUser } from '../../application/usecases/GetCurrentUser';
import { AuthRequest } from '../middleware/authMiddleware';

export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
    private getCurrentUser: GetCurrentUser,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUser.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes('既に登録されています')) {
        res.status(409).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUser.execute(req.body);
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes('正しくありません')) {
        res.status(401).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  me = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.getCurrentUser.execute(req.userId!);
      res.json({ user });
    } catch (error) {
      if (error instanceof Error && error.message.includes('見つかりません')) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
}
