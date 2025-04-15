import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { IExpenseRepository } from '../../contexts/expenses/domain/expense.repository';
import { ExpenseSupabaseRepository } from '../../contexts/expenses/infrastructure/expense.supabase.repository';
import { Expense } from '../../contexts/expenses/domain/expense.entity';
import { GetCurrentUserIdUseCase } from '../../contexts/auth/application/get-current-user-id.use-case';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterLink,
    EmptyStateComponent
  ]
})
export class HomePage implements OnInit {
  @ViewChild('expensesChart') private chartCanvas!: ElementRef;

  private expenseRepository = inject(ExpenseSupabaseRepository) as IExpenseRepository;
  private getCurrentUserIdUseCase = inject(GetCurrentUserIdUseCase);
  private chart: Chart | null = null;

  userName: string = 'Felipe';
  expenses: Expense[] = [];
  total: number = 0;
  categoryProgress = [
    { name: 'Transporte', percentage: 80, color: 'primary' },
    { name: 'Comida', percentage: 40, color: 'success' }
  ];

  ngOnInit() {
    this.loadExpenses();
  }

  async loadExpenses() {
    const currentDate = new Date();
    const userId = await this.getCurrentUserIdUseCase.execute();
    this.expenses = await this.expenseRepository.findByMonth(
      userId,
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    this.calculateTotal();
    this.initChart();
  }

  private calculateTotal() {
    this.total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  private initChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir el gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Agrupar gastos por categoría
    const expensesByCategory = this.expenses.reduce((acc, expense) => {
      const categoryId = expense.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = 0;
      }
      acc[categoryId] += expense.amount;
      return acc;
    }, {} as { [key: string]: number });

    // Preparar datos para el gráfico
    const data = {
      labels: Object.keys(expensesByCategory),
      datasets: [{
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }]
    };

    // Crear el gráfico
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  getCategoryName(categoryId: number): string {
    const categories: { [key: number]: string } = {
      1: 'Alimentación',
      2: 'Transporte',
      3: 'Entretenimiento',
      4: 'Servicios',
      5: 'Otros'
    };
    return categories[categoryId] || 'Otros';
  }

  async handleEdit(expense: Expense) {
    // TODO: Implementar navegación a la página de edición
  }

  async handleDelete(expenseId: string) {
    // TODO: Implementar eliminación de gasto
  }
}
