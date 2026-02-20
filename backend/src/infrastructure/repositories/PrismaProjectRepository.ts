import { PrismaClient } from '@prisma/client';
import { Project } from '../../domain/entities/Project';
import {
  IProjectRepository,
  CreateProjectData,
  UpdateProjectData,
} from '../../domain/repositories/IProjectRepository';

export class PrismaProjectRepository implements IProjectRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({ where: { id } }) as Promise<Project | null>;
  }

  async findByUserId(userId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    }) as Promise<Project[]>;
  }

  async create(data: CreateProjectData): Promise<Project> {
    return this.prisma.project.create({ data }) as Promise<Project>;
  }

  async update(id: string, data: UpdateProjectData): Promise<Project> {
    return this.prisma.project.update({ where: { id }, data }) as Promise<Project>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }
}
