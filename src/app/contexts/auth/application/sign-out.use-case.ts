import { Injectable, Inject } from '@angular/core';
import { IAuthRepository, AuthRepository } from '../domain/auth.repository';

@Injectable({
  providedIn: 'root'
})
export class SignOutUseCase {
  constructor(
    @Inject(AuthRepository) private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<void> {
    return this.authRepository.signOut();
  }
}
