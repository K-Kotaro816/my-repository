import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; passwordHash: string; displayName?: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
