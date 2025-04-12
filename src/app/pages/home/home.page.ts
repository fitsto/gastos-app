import { Component, OnInit, Inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExpenseCardComponent } from '../../shared/components/expense-card/expense-card.component';
import { Expense } from '../../contexts/expenses/domain/expense.entity';
import { ExpenseRepository, IExpenseRepository } from '../../contexts/expenses/domain/expense.repository';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, ExpenseCardComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Mis Gastos</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/add-expense">
            <ion-icon name="add-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <!-- Resumen del mes -->
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Total del Mes</ion-card-subtitle>
            <ion-card-title>{{ totalAmount | currency }}</ion-card-title>
          </ion-card-header>
        </ion-card>

        <!-- Lista de gastos -->
        <div class="tablet-grid">
          <app-expense-card
            *ngFor="let expense of expenses"
            [expense]="expense"
            [categoryName]="getCategoryName(expense.categoryId)"
            (onEdit)="handleEdit($event)"
            (onDelete)="handleDelete($event)"
          ></app-expense-card>
        </div>

        <!-- Estado vacío -->
        <div *ngIf="expenses.length === 0" class="app-empty-state">
          <ion-icon name="wallet-outline" size="large"></ion-icon>
          <h2>No hay gastos registrados</h2>
          <p>Comienza agregando tu primer gasto</p>
          <ion-button routerLink="/add-expense" class="app-button">
            Agregar Gasto
          </ion-button>
        </div>
      </div>
    </ion-content>
  `
})
export class HomePage implements OnInit {
  expenses: Expense[] = [];
  totalAmount: number = 0;

  constructor(
    @Inject(ExpenseRepository) private expenseRepository: IExpenseRepository
  ) {}

  ngOnInit() {
    this.loadExpenses();
  }

  async loadExpenses() {
    // TODO: Obtener el userId del servicio de autenticación
    const userId = 'current-user-id';
    const currentDate = new Date();
    this.expenses = await this.expenseRepository.findByMonth(
      userId,
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  getCategoryName(categoryId: string): string {
    // TODO: Implementar obtención del nombre de la categoría
    return 'Categoría';
  }

  async handleEdit(expense: Expense) {
    // TODO: Implementar navegación a la página de edición
    console.log('Editar gasto:', expense);
  }

  async handleDelete(id: string) {
    try {
      await this.expenseRepository.delete(id);
      this.expenses = this.expenses.filter(expense => expense.id !== id);
      this.calculateTotal();
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
    }
  }
}
