import fs from 'fs';
import path from 'path';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { Project } from '../../domain/entities/Project';
import { UPLOAD_BASE } from '../../infrastructure/config/upload';

interface UploadFloorPlanInput {
  projectId: string;
  userId: string;
  filePath: string;
}

export class UploadFloorPlan {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(input: UploadFloorPlanInput): Promise<Project> {
    const project = await this.projectRepository.findById(input.projectId);
    if (!project) {
      throw new Error('プロジェクトが見つかりません');
    }
    if (project.userId !== input.userId) {
      throw new Error('このプロジェクトへのアクセス権がありません');
    }

    if (project.floorPlanImagePath) {
      const oldPath = path.join(UPLOAD_BASE, project.floorPlanImagePath);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    return this.projectRepository.update(input.projectId, {
      floorPlanImagePath: input.filePath,
      floorPlanMode: 'image',
    });
  }
}
