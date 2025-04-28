
import { IAuthRepository } from '../domain/auth.repository';
import { User } from '../domain/user.entity';


export class GetCurrentUserUseCase {
  constructor(
    private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}
