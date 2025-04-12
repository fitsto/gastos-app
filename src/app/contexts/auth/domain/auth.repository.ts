import { User } from './user.entity';

export interface IAuthRepository {
  signUp(email: string, password: string): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export const AuthRepository = Symbol('AuthRepository');
