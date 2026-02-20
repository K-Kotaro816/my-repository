import fs from 'fs';
import path from 'path';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { Project } from '../../domain/entities/Project';
import { UPLOAD_BASE } from '../../infrastructure/config/upload';

export class DeleteFloorPlan {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(projectId: string, userId: string): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error('プロジェクトが見つかりません');
    }
    if (project.userId !== userId) {
      throw new Error('このプロジェクトへのアクセス権がありません');
    }

    if (project.floorPlanImagePath) {
      const filePath = path.join(UPLOAD_BASE, project.floorPlanImagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return this.projectRepository.update(projectId, {
      floorPlanImagePath: null,
      floorPlanMode: 'draw',
    });
  }
}
