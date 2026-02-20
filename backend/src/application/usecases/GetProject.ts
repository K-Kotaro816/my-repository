import { Project } from '../../domain/entities/Project';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';

export class GetProject {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(projectId: string, userId: string): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error('プロジェクトが見つかりません');
    }
    if (project.userId !== userId) {
      throw new Error('このプロジェクトへのアクセス権がありません');
    }
    return project;
  }
}
