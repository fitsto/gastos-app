import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GetCurrentUserUseCase } from 'src/contexts/auth/application/get-current-user.use-case';

export const noAuthGuard = async () => {
  const router = inject(Router);
  const getCurrentUserUseCase = inject(GetCurrentUserUseCase);

  try {
    const user = await getCurrentUserUseCase.execute();
    if (user) {
      return router.createUrlTree(['/home']);
    }
    return true;
  } catch {
    return true;
  }
};
