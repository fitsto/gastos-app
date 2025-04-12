import { Injectable, Inject } from '@angular/core';
import { IAuthRepository, AuthRepository } from '../domain/auth.repository';
import { User } from '../domain/user.entity';

@Injectable({
  providedIn: 'root'
})
export class SignInUseCase {
  constructor(
    @Inject(AuthRepository) private authRepository: IAuthRepository
  ) {}

  async execute(email: string, password: string): Promise<User> {
    return this.authRepository.signIn(email, password);
  }
}
