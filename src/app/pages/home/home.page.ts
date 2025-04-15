import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { IExpenseRepository } from '../../contexts/expenses/domain/expense.repository';
import { ExpenseSupabaseRepository } from '../../contexts/expenses/infrastructure/expense.supabase.repository';
import { Expense } from '../../contexts/expenses/domain/expense.entity';
import { GetCurrentUserIdUseCase } from '../../contexts/auth/application/get-current-user-id.use-case';
import { AuthSupabaseRepository } from '../../contexts/auth/infrastructure/auth.supabase.repository';
import { ChileanCurrencyPipe } from '../../shared/pipes/chilean-currency.pipe';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonProgressBar,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, add, timeOutline, listOutline, handLeftOutline, walletOutline } from 'ionicons/icons';
import { CategorySupabaseRepository } from '../../contexts/categories/infrastructure/category.supabase.repository';
import { Category } from '../../contexts/categories/domain/category.entity';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    EmptyStateComponent,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonProgressBar,
    ChileanCurrencyPipe,
    IonCard,
    IonCardContent
  ],
  providers: [ChileanCurrencyPipe]
})
export class HomePage implements OnInit {
  @ViewChild('expensesChart') private chartCanvas!: ElementRef;

  private expenseRepository = inject(ExpenseSupabaseRepository);
  private categoryRepository = inject(CategorySupabaseRepository);
  private authRepository = inject(AuthSupabaseRepository);
  private chileanCurrencyPipe = inject(ChileanCurrencyPipe);

  expenses: Expense[] = [];
  categories: Category[] = [];
  totalAmount = 0;
  loading = true;
  chart: Chart | null = null;

  constructor() {
    addIcons({handLeftOutline,addOutline,walletOutline,timeOutline,listOutline,add});
  }

  ngOnInit() {
    this.loadExpensesAndCategories();
  }

  ionViewWillEnter() {
    this.loadExpensesAndCategories();
  }

  async loadExpensesAndCategories() {
    this.loading = true;
    try {
      const currentDate = new Date();
      const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
      const userId = await getCurrentUserIdUseCase.execute();
      const [expenses, categories] = await Promise.all([
        this.expenseRepository.findByMonth(
          userId,
          currentDate.getFullYear(),
          currentDate.getMonth() + 1
        ),
        this.categoryRepository.findAll(userId)
      ]);
      this.expenses = expenses;
      this.categories = categories;
      this.calculateTotal();
      this.initChart();
    } catch (error) {
      console.error('Error al cargar gastos o categorías:', error);
    } finally {
      this.loading = false;
    }
  }

  private calculateTotal() {
    this.totalAmount = this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  private initChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas || this.expenses.length === 0 || this.categories.length === 0) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Agrupar gastos por categoría
    const expensesByCategory = this.expenses.reduce((acc, expense) => {
      const categoryId = expense.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = 0;
      }
      acc[categoryId] += expense.amount;
      return acc;
    }, {} as { [key: number]: number });

    // Filtrar categorías que tienen gastos
    const usedCategories = this.categories.filter(cat => expensesByCategory[cat.id] !== undefined);

    // Preparar datos para el gráfico
    const data = {
      labels: usedCategories.map(cat => cat.name),
      datasets: [{
        data: usedCategories.map(cat => expensesByCategory[cat.id]),
        backgroundColor: usedCategories.map(cat => cat.color)
      }]
    };

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  }

  get formattedTotal(): string {
    return this.chileanCurrencyPipe.transform(this.totalAmount);
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  }

  async handleEdit(expense: Expense) {
    // TODO: Implementar navegación a la página de edición
  }

  async handleDelete(expenseId: string) {
    // TODO: Implementar eliminación de gasto
  }
}
