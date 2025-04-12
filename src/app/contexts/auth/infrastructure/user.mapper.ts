import { User } from '../domain/user.entity';
import { SupabaseUser } from './supabase-user.model';

export class UserMapper {
  static toDomain(supabaseUser: SupabaseUser): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      createdAt: supabaseUser.created_at,
      updatedAt: supabaseUser.updated_at
    };
  }
}
