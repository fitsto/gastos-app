import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { AuthRepository } from './contexts/auth/domain/auth.repository';
import { AuthSupabaseRepository } from './contexts/auth/infrastructure/auth.supabase.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    {
      provide: AuthRepository,
      useClass: AuthSupabaseRepository
    }
  ]
};
