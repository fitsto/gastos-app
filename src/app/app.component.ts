import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthSupabaseRepository } from './contexts/auth/infrastructure/auth.supabase.repository';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  providers: [AuthSupabaseRepository]
})
export class AppComponent {
  constructor() {}
}
