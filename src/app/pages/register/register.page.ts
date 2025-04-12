import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../contexts/auth/application/auth.service';
import { SignUpUseCase } from '../../contexts/auth/application/sign-up.use-case';
import { User } from '../../contexts/auth/domain/auth.entity';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ion-text-center ion-padding">
        <h1>Crear Cuenta</h1>
        <p>Únete a Gastos App</p>
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <ion-item class="app-input">
          <ion-label position="floating">Email</ion-label>
          <ion-input
            type="email"
            formControlName="email"
            required
          ></ion-input>
        </ion-item>

        <ion-item class="app-input">
          <ion-label position="floating">Contraseña</ion-label>
          <ion-input
            type="password"
            formControlName="password"
            required
          ></ion-input>
        </ion-item>

        <ion-item class="app-input">
          <ion-label position="floating">Confirmar Contraseña</ion-label>
          <ion-input
            type="password"
            formControlName="confirmPassword"
            required
          ></ion-input>
        </ion-item>

        <ion-button
          expand="block"
          type="submit"
          class="app-button"
          [disabled]="!registerForm.valid || isLoading"
        >
          {{ isLoading ? 'Creando cuenta...' : 'Registrarse' }}
        </ion-button>

        <ion-button
          expand="block"
          fill="clear"
          routerLink="/login"
          [disabled]="isLoading"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </ion-button>
      </form>

      <ion-alert
        [isOpen]="!!error"
        [header]="'Error'"
        [message]="error"
        [buttons]="['OK']"
        (didDismiss)="error = null"
      ></ion-alert>
    </ion-content>
  `
})
export class RegisterPage {
  registerForm: FormGroup;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private signUpUseCase: SignUpUseCase
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        const { email, password } = this.registerForm.value;
        await this.signUpUseCase.execute(email, password);
        this.router.navigate(['/home']);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al registrar usuario';
      }
    }
  }
}
