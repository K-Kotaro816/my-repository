import { UserWithoutPassword } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../interfaces/IPasswordHasher';
import { ITokenService } from '../interfaces/ITokenService';

interface RegisterInput {
  email: string;
  password: string;
  displayName?: string;
}

interface RegisterOutput {
  token: string;
  user: UserWithoutPassword;
}

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('このメールアドレスは既に登録されています');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.userRepository.create({
      email: input.email,
      passwordHash,
      displayName: input.displayName,
    });

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
