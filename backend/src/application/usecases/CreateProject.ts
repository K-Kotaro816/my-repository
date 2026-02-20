import { Project } from '../../domain/entities/Project';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';

interface CreateProjectInput {
  userId: string;
  name: string;
  roomWidthMm: number;
  roomHeightMm: number;
}

export class CreateProject {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    return this.projectRepository.create(input);
  }
}
