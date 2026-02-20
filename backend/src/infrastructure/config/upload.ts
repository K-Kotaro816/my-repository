import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request } from 'express';

export const UPLOAD_BASE = path.resolve(__dirname, '../../../uploads');

const storage = multer.diskStorage({
  destination: (req: Request, _file, cb) => {
    const projectId = String(req.params.id);
    const dir = path.join(UPLOAD_BASE, 'projects', projectId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `floorplan-${Date.now()}${ext}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('許可されていないファイル形式です。JPEG, PNG, WebPのみアップロード可能です。'));
  }
};

export const uploadFloorPlan = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
