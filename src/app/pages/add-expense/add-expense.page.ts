import { Component, OnInit, Inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Expense } from '../../contexts/expenses/domain/expense.entity';
import { ExpenseRepository, IExpenseRepository } from '../../contexts/expenses/domain/expense.repository';
import { AddExpenseUseCase } from '../../contexts/expenses/application/add-expense.use-case';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Agregar Gasto</ion-title>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="ion-padding">
        <!-- Monto -->
        <ion-item>
          <ion-label position="floating">Monto</ion-label>
          <ion-input
            type="number"
            formControlName="amount"
            placeholder="0.00"
            inputmode="decimal"
          ></ion-input>
        </ion-item>
        <ion-text color="danger" *ngIf="expenseForm.get('amount')?.invalid && expenseForm.get('amount')?.touched">
          <p>El monto es requerido y debe ser mayor a 0</p>
        </ion-text>

        <!-- Categoría -->
        <ion-item>
          <ion-label position="floating">Categoría</ion-label>
          <ion-select formControlName="categoryId">
            <ion-select-option value="food">Alimentación</ion-select-option>
            <ion-select-option value="transport">Transporte</ion-select-option>
            <ion-select-option value="entertainment">Entretenimiento</ion-select-option>
            <ion-select-option value="bills">Servicios</ion-select-option>
            <ion-select-option value="other">Otros</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-text color="danger" *ngIf="expenseForm.get('categoryId')?.invalid && expenseForm.get('categoryId')?.touched">
          <p>La categoría es requerida</p>
        </ion-text>

        <!-- Fecha -->
        <ion-item>
          <ion-label position="floating">Fecha</ion-label>
          <ion-datetime
            formControlName="date"
            display-format="DD/MM/YYYY"
            picker-format="DD/MM/YYYY"
          ></ion-datetime>
        </ion-item>

        <!-- Descripción -->
        <ion-item>
          <ion-label position="floating">Descripción</ion-label>
          <ion-textarea
            formControlName="description"
            rows="3"
            placeholder="Agrega una descripción opcional"
          ></ion-textarea>
        </ion-item>

        <!-- Botón de envío -->
        <ion-button
          type="submit"
          expand="block"
          [disabled]="expenseForm.invalid"
          class="ion-margin-top"
        >
          Guardar Gasto
        </ion-button>
      </form>
    </ion-content>
  `
})
export class AddExpensePage implements OnInit {
  expenseForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private addExpenseUseCase: AddExpenseUseCase
  ) {
    this.expenseForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      description: ['']
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.expenseForm.valid) {
      try {
        const expenseData = {
          ...this.expenseForm.value,
          userId: 'current-user-id' // TODO: Obtener del servicio de autenticación
        };

        await this.addExpenseUseCase.execute(expenseData);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al guardar el gasto:', error);
        // TODO: Mostrar mensaje de error al usuario
      }
    }
  }
}