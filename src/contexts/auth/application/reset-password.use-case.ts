import { Injectable, Inject } from '@angular/core';
import { IAuthRepository, AuthRepository } from '../domain/auth.repository';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordUseCase {
  constructor(
    @Inject(AuthRepository) private authRepository: IAuthRepository
  ) {}

  async execute(email: string): Promise<void> {
    return this.authRepository.resetPassword(email);
  }
}
