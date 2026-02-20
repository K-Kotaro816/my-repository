import { IProjectRepository } from '../../domain/repositories/IProjectRepository';

export class DeleteProject {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(projectId: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error('プロジェクトが見つかりません');
    }
    if (project.userId !== userId) {
      throw new Error('このプロジェクトへのアクセス権がありません');
    }
    await this.projectRepository.delete(projectId);
  }
}
