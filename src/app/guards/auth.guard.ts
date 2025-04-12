import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GetCurrentUserUseCase } from '../contexts/auth/application/get-current-user.use-case';

export const authGuard = async () => {
  const router = inject(Router);
  const getCurrentUserUseCase = inject(GetCurrentUserUseCase);

  try {
    const user = await getCurrentUserUseCase.execute();
    return !!user;
  } catch {
    return router.createUrlTree(['/login']);
  }
};
