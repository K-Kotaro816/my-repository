import { Project } from '../../domain/entities/Project';
import {
  IProjectRepository,
  UpdateProjectData,
} from '../../domain/repositories/IProjectRepository';

interface UpdateProjectInput {
  projectId: string;
  userId: string;
  data: UpdateProjectData;
}

export class UpdateProject {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(input: UpdateProjectInput): Promise<Project> {
    const project = await this.projectRepository.findById(input.projectId);
    if (!project) {
      throw new Error('プロジェクトが見つかりません');
    }
    if (project.userId !== input.userId) {
      throw new Error('このプロジェクトへのアクセス権がありません');
    }
    return this.projectRepository.update(input.projectId, input.data);
  }
}
