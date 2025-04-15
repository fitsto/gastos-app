import { User } from './user.entity';
import { InjectionToken } from '@angular/core';
import { SessionResponse } from './session.entity';

export interface IAuthRepository {
  signUp(email: string, password: string): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getCurrentUserId(): Promise<string>;
  getSession(): Promise<SessionResponse>;
}

export const AuthRepository = new InjectionToken<IAuthRepository>('AuthRepository');
