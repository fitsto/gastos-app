import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ExpenseSupabaseRepository } from '../../contexts/expenses/infrastructure/expense.supabase.repository';
import { Expense } from '../../contexts/expenses/domain/expense.entity';

Chart.register(...registerables);

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

  private expenseRepository = inject(ExpenseSupabaseRepository);
  private chart: Chart | null = null;

  userName: string = 'Felipe';
  expenses: Expense[] = [];
  totalAmount: number = 0;
  categoryProgress = [
    { name: 'Transporte', percentage: 80, color: 'primary' },
    { name: 'Comida', percentage: 40, color: 'success' }
  ];

  ngOnInit() {
    this.loadExpenses();
  }

  async loadExpenses() {
    const currentDate = new Date();
    this.expenses = await this.expenseRepository.findByMonth(
      'current-user-id',
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    this.calculateTotal();
    this.initChart();
  }

  private calculateTotal() {
    this.totalAmount = this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  private initChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    // Agrupar gastos por categoría
    const expensesByCategory = this.expenses.reduce((acc, expense) => {
      const category = this.getCategoryName(expense.categoryId);
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });

    const data = {
      labels: Object.keys(expensesByCategory),
      datasets: [{
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#4CAF50', // Verde
          '#2196F3', // Azul
          '#FFC107', // Amarillo
          '#9C27B0', // Morado
          '#757575'  // Gris
        ]
      }]
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 12,
                family: "'Roboto', sans-serif"
              }
            }
          }
        }
      }
    });
  }

  getCategoryName(categoryId: string): string {
    const categories: { [key: string]: string } = {
      'food': 'Alimentación',
      'transport': 'Transporte',
      'entertainment': 'Entretenimiento',
      'bills': 'Servicios',
      'other': 'Otros'
    };
    return categories[categoryId] || 'Desconocida';
  }

  async handleEdit(expense: Expense) {
    // TODO: Implementar navegación a la página de edición
  }

  async handleDelete(expenseId: string) {
    // TODO: Implementar eliminación de gasto
  }
}
