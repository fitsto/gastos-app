import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSupabaseRepository } from 'src/contexts/auth/infrastructure/auth.supabase.repository';
import { GetCurrentUserUseCase } from 'src/contexts/auth/application/get-current-user.use-case';


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
