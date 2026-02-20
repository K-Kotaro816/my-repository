import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { ITokenService } from '../../application/interfaces/ITokenService';

const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(100, 'パスワードは100文字以下で入力してください'),
  displayName: z.string().max(100, '表示名は100文字以下で入力してください').optional(),
});

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 認証API
 */

export function createAuthRoutes(
  authController: AuthController,
  tokenService: ITokenService,
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: ユーザー登録
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 minLength: 8
   *                 example: password123
   *               displayName:
   *                 type: string
   *                 example: テストユーザー
   *     responses:
   *       201:
   *         description: 登録成功
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: バリデーションエラー
   *       409:
   *         description: メールアドレスが既に登録済み
   */
  router.post('/register', validate(registerSchema), authController.register);

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: ログイン
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       200:
   *         description: ログイン成功
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: 認証失敗
   */
  router.post('/login', validate(loginSchema), authController.login);

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: 現在のユーザー情報取得
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: ユーザー情報
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: 認証が必要
   */
  router.get('/me', authMiddleware, authController.me);

  return router;
}
