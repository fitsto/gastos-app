import { Injectable, Inject } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { IAuthRepository, AuthRepository } from '../domain/auth.repository';
import { User } from '../domain/user.entity';
import { UserMapper } from './user.mapper';
import { SupabaseUser } from './supabase-user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthSupabaseRepository implements IAuthRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async signUp(email: string, password: string): Promise<User> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    return UserMapper.toDomain(data.user as unknown as SupabaseUser);
  }

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    return UserMapper.toDomain(data.user as unknown as SupabaseUser);
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await this.supabase.auth.getUser();

    if (error) throw error;
    if (!user) return null;

    return UserMapper.toDomain(user as unknown as SupabaseUser);
  }
}
