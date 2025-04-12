import { Component, OnInit, Inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonItemGroup, IonItem, IonLabel, IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ExpenseCardComponent } from '../../shared/components/expense-card/expense-card.component';
import { Expense } from '../../contexts/expenses/domain/expense.entity';
import { ExpenseRepository, IExpenseRepository } from '../../contexts/expenses/domain/expense.repository';

@Component({
  selector: 'app-history',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonItemGroup,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
    ExpenseCardComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Historial de Gastos</ion-title>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <!-- Filtros -->
        <ion-item-group>
          <ion-item>
            <ion-label>Mes</ion-label>
            <ion-select [(ngModel)]="selectedMonth" (ionChange)="applyFilters()">
              <ion-select-option *ngFor="let month of months" [value]="month.value">
                {{ month.label }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label>Categoría</ion-label>
            <ion-select [(ngModel)]="selectedCategory" (ionChange)="applyFilters()">
              <ion-select-option value="">Todas</ion-select-option>
              <ion-select-option value="food">Alimentación</ion-select-option>
              <ion-select-option value="transport">Transporte</ion-select-option>
              <ion-select-option value="entertainment">Entretenimiento</ion-select-option>
              <ion-select-option value="bills">Servicios</ion-select-option>
              <ion-select-option value="other">Otros</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-item-group>

        <!-- Resumen -->
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Total Filtrado</ion-card-subtitle>
            <ion-card-title>{{ filteredTotal | currency }}</ion-card-title>
          </ion-card-header>
        </ion-card>

        <!-- Lista de gastos -->
        <div class="tablet-grid">
          <app-expense-card
            *ngFor="let expense of filteredExpenses"
            [expense]="expense"
            [categoryName]="getCategoryName(expense.categoryId)"
            (onEdit)="handleEdit($event)"
            (onDelete)="handleDelete($event)"
          ></app-expense-card>
        </div>

        <!-- Estado vacío -->
        <div *ngIf="filteredExpenses.length === 0" class="app-empty-state">
          <ion-icon name="time-outline" size="large"></ion-icon>
          <h2>No hay gastos en este período</h2>
          <p>Intenta cambiar los filtros o agregar un nuevo gasto</p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .tablet-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .app-empty-state {
      text-align: center;
      padding: 32px;
      color: var(--ion-color-medium);
    }

    .app-empty-state ion-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
  `]
})
export class HistoryPage implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  filteredTotal: number = 0;
  selectedMonth: string = '';
  selectedCategory: string = '';
  months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  constructor(
    @Inject(ExpenseRepository) private expenseRepository: IExpenseRepository
  ) {
    const currentDate = new Date();
    this.selectedMonth = (currentDate.getMonth() + 1).toString();
  }

  ngOnInit() {
    this.loadExpenses();
  }

  async loadExpenses() {
    // TODO: Obtener el userId del servicio de autenticación
    const userId = 'current-user-id';
    this.expenses = await this.expenseRepository.findAll(userId);
    this.applyFilters();
  }

  applyFilters() {
    this.filteredExpenses = this.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const matchesMonth = !this.selectedMonth ||
        (expenseDate.getMonth() + 1).toString() === this.selectedMonth;
      const matchesCategory = !this.selectedCategory ||
        expense.categoryId === this.selectedCategory;

      return matchesMonth && matchesCategory;
    });

    this.calculateTotal();
  }

  calculateTotal() {
    this.filteredTotal = this.filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
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
      this.applyFilters();
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
    }
  }
}
