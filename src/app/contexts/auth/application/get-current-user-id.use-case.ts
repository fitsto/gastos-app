import { IAuthRepository } from '../domain/auth.repository';

export class GetCurrentUserIdUseCase {
  constructor(
    private readonly authRepository: IAuthRepository
  ) {}

  async execute(): Promise<string> {
    return await this.authRepository.getCurrentUserId();
  }
}
