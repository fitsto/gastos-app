import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GetCurrentUserUseCase } from '../contexts/auth/application/get-current-user.use-case';
import { AuthSupabaseRepository } from '../contexts/auth/infrastructure/auth.supabase.repository';

export const authGuard = async () => {
  const router = inject(Router);
  const authSupabaseRepository = inject(AuthSupabaseRepository);

  try {
    const getCurrentUserUseCase = new GetCurrentUserUseCase(authSupabaseRepository);
    const user = await getCurrentUserUseCase.execute();
    return !!user;
  } catch {
    return router.createUrlTree(['/login']);
  }
};
