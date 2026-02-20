import { UserWithoutPassword } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../interfaces/IPasswordHasher';
import { ITokenService } from '../interfaces/ITokenService';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOutput {
  token: string;
  user: UserWithoutPassword;
}

export class LoginUser {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    const isValid = await this.passwordHasher.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    const token = this.tokenService.generate({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
