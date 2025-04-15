import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ExpenseSupabaseRepository } from '../../contexts/expenses/infrastructure/expense.supabase.repository';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class AddExpensePage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private expenseRepository = inject(ExpenseSupabaseRepository);

  expenseForm!: FormGroup;
  isSubmitting = false;

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.expenseForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      description: ['']
    });
  }

  async onSubmit() {
    if (this.expenseForm.invalid) return;

    try {
      this.isSubmitting = true;

      const expense = {
        ...this.expenseForm.value,
        userId: 'current-user-id', // TODO: Obtener del servicio de auth
        amount: parseFloat(this.expenseForm.value.amount)
      };

      await this.expenseRepository.create(expense);

      // Mostrar mensaje de éxito
      const toast = document.createElement('ion-toast');
      toast.message = 'Gasto guardado correctamente';
      toast.duration = 2000;
      toast.position = 'bottom';
      toast.color = 'success';
      document.body.appendChild(toast);
      await toast.present();

      // Redirigir al home
      this.router.navigate(['/home']);

    } catch (error) {
      console.error('Error al guardar el gasto:', error);

      // Mostrar mensaje de error
      const toast = document.createElement('ion-toast');
      toast.message = 'Error al guardar el gasto';
      toast.duration = 3000;
      toast.position = 'bottom';
      toast.color = 'danger';
      document.body.appendChild(toast);
      await toast.present();

    } finally {
      this.isSubmitting = false;
    }
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
