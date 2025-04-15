import { IAuthRepository } from '../domain/auth.repository';
import { SessionResponse } from '../domain/session.entity';

export class GetSessionUseCase {
  constructor(
    private readonly authRepository: IAuthRepository
  ) {}

  async execute(): Promise<SessionResponse> {
    return await this.authRepository.getSession();
  }
}
