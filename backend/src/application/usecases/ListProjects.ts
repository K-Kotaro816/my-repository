import { Project } from '../../domain/entities/Project';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';

export class ListProjects {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(userId: string): Promise<Project[]> {
    return this.projectRepository.findByUserId(userId);
  }
}
