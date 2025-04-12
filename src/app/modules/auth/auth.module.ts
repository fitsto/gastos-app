import { NgModule } from '@angular/core';
import { AuthSupabaseRepository } from '../../contexts/auth/infrastructure/auth.supabase.repository';
import { AuthRepository } from '../../contexts/auth/domain/auth.repository';

@NgModule({
  providers: [
    {
      provide: AuthRepository,
      useClass: AuthSupabaseRepository
    }
  ]
})
export class AuthModule { }
