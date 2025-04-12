import { Injectable, Inject } from '@angular/core';
import { IAuthRepository, AuthRepository } from '../domain/auth.repository';
import { User } from '../domain/user.entity';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentUserUseCase {
  constructor(
    @Inject(AuthRepository) private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}
