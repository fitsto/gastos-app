import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SignInUseCase } from '../../contexts/auth/application/sign-in.use-case';
import { ResetPasswordUseCase } from '../../contexts/auth/application/reset-password.use-case';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  loginForm: FormGroup;
  error: string | null = null;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private signInUseCase: SignInUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      try {
        const { email, password } = this.loginForm.value;
        await this.signInUseCase.execute(email, password);
        this.router.navigate(['/home']);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al iniciar sesión';
      } finally {
        this.isLoading = false;
      }
    }
  }

  async resetPassword() {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      this.error = 'Por favor ingresa tu email';
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      await this.resetPasswordUseCase.execute(email);
      this.error = 'Se ha enviado un email para restablecer tu contraseña';
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Error al restablecer la contraseña';
    } finally {
      this.isLoading = false;
    }
  }
}
