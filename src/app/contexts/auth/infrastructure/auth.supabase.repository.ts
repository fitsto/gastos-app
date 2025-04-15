import { Injectable, Inject } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { IAuthRepository, AuthRepository } from '../domain/auth.repository';
import { User } from '../domain/user.entity';
import { SessionResponse } from '../domain/session.entity';
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

  async getCurrentUserId(): Promise<string> {
    const { data: { user }, error } = await this.supabase.auth.getUser();

    if (error) throw error;
    if (!user) throw new Error('No user found');

    return user.id;
  }

  async getSession(): Promise<SessionResponse> {
    const { data, error } = await this.supabase.auth.getSession();

    if (error) {
      return { data: { session: null }, error };
    }

    if (!data.session) {
      return { data: { session: null }, error: null };
    }

    const session: SessionResponse['data']['session'] = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at ?? 0,
      user_id: data.session.user.id
    };

    return { data: { session }, error: null };
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
