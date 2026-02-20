import { UserWithoutPassword } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class GetCurrentUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
