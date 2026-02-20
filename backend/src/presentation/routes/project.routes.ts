import { Router } from 'express';
import { z } from 'zod';
import { ProjectController } from '../controllers/ProjectController';
import { validate } from '../middleware/validate';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { ITokenService } from '../../application/interfaces/ITokenService';

const createProjectSchema = z.object({
  name: z.string().min(1, 'プロジェクト名を入力してください').max(255),
  roomWidthMm: z.number().min(1000, '部屋の幅は1000mm以上').max(50000, '部屋の幅は50000mm以下'),
  roomHeightMm: z
    .number()
    .min(1000, '部屋の高さは1000mm以上')
    .max(50000, '部屋の高さは50000mm以下'),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  roomWidthMm: z.number().min(1000).max(50000).optional(),
  roomHeightMm: z.number().min(1000).max(50000).optional(),
  wallData: z.unknown().optional(),
  canvasState: z.unknown().optional(),
  floorPlanMode: z.enum(['draw', 'image']).optional(),
});

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: プロジェクト管理API
 */

export function createProjectRoutes(
  projectController: ProjectController,
  tokenService: ITokenService,
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  /**
   * @swagger
   * /api/projects:
   *   get:
   *     summary: プロジェクト一覧取得
   *     tags: [Projects]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: プロジェクト一覧
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Project'
   */
  router.get('/', authMiddleware, projectController.list);

  /**
   * @swagger
   * /api/projects/{id}:
   *   get:
   *     summary: プロジェクト詳細取得
   *     tags: [Projects]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: プロジェクト詳細
   *       404:
   *         description: プロジェクトが見つからない
   */
  router.get('/:id', authMiddleware, projectController.get);

  /**
   * @swagger
   * /api/projects:
   *   post:
   *     summary: プロジェクト新規作成
   *     tags: [Projects]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - roomWidthMm
   *               - roomHeightMm
   *             properties:
   *               name:
   *                 type: string
   *                 example: リビングルーム
   *               roomWidthMm:
   *                 type: integer
   *                 example: 6000
   *               roomHeightMm:
   *                 type: integer
   *                 example: 4000
   *     responses:
   *       201:
   *         description: 作成成功
   *       400:
   *         description: バリデーションエラー
   */
  router.post('/', authMiddleware, validate(createProjectSchema), projectController.create);

  /**
   * @swagger
   * /api/projects/{id}:
   *   put:
   *     summary: プロジェクト更新
   *     tags: [Projects]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               wallData:
   *                 type: object
   *               canvasState:
   *                 type: object
   *     responses:
   *       200:
   *         description: 更新成功
   *       404:
   *         description: プロジェクトが見つからない
   */
  router.put('/:id', authMiddleware, validate(updateProjectSchema), projectController.update);

  /**
   * @swagger
   * /api/projects/{id}:
   *   delete:
   *     summary: プロジェクト削除
   *     tags: [Projects]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: 削除成功
   *       404:
   *         description: プロジェクトが見つからない
   */
  router.delete('/:id', authMiddleware, projectController.remove);

  return router;
}
