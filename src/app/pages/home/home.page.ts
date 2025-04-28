import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
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
import { TransactionSupabaseRepository } from 'src/contexts/transactions/infrastructure/transaction.supabase.repository';
import { CategorySupabaseRepository } from 'src/contexts/categories/infrastructure/category.supabase.repository';
import { AuthSupabaseRepository } from 'src/contexts/auth/infrastructure/auth.supabase.repository';
import { Transaction } from 'src/contexts/transactions/domain/transaction.entity';
import { Category } from 'src/contexts/categories/domain/category.entity';
import { GetCurrentUserIdUseCase } from 'src/contexts/auth/application/get-current-user-id.use-case';

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
  @ViewChild('transactionsChart') private chartCanvas!: ElementRef;

  private transactionRepository = inject(TransactionSupabaseRepository);
  private categoryRepository = inject(CategorySupabaseRepository);
  private authRepository = inject(AuthSupabaseRepository);
  private chileanCurrencyPipe = inject(ChileanCurrencyPipe);

  transactions: Transaction[] = [];
  categories: Category[] = [];
  totalAmount = 0;
  loading = true;
  chart: Chart | null = null;

  constructor() {
    addIcons({handLeftOutline,addOutline,walletOutline,timeOutline,listOutline,add});
  }

  ngOnInit() {
    this.loadTransactionsAndCategories();
  }

  ionViewWillEnter() {
    this.loadTransactionsAndCategories();
  }

  async loadTransactionsAndCategories() {
    this.loading = true;
    try {
      const currentDate = new Date();
      const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
      const userId = await getCurrentUserIdUseCase.execute();
      const [transactions, categories] = await Promise.all([
        this.transactionRepository.getTransactionsByMonth(
          userId,
          currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0')
        ),
        this.categoryRepository.findAll(userId)
      ]);
      this.transactions = transactions;
      this.categories = categories;
      this.calculateTotal();
      this.initChart();
    } catch (error) {
      console.error('Error al cargar transacciones o categorías:', error);
    } finally {
      this.loading = false;
    }
  }

  private calculateTotal() {
    this.totalAmount = this.transactions.reduce((total, transaction) => {
      return transaction.type === 'expense' ? total - transaction.amount : total + transaction.amount;
    }, 0);
  }

  private initChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas || this.transactions.length === 0 || this.categories.length === 0) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Agrupar gastos por categoría
    const expensesByCategory = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const categoryId = transaction.categoryId;
        if (!acc[categoryId]) {
          acc[categoryId] = 0;
        }
        acc[categoryId] += transaction.amount;
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
    return this.chileanCurrencyPipe.transform(Math.abs(this.totalAmount));
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  }

  async handleEdit(transaction: Transaction) {
    // TODO: Implementar navegación a la página de edición
  }

  async handleDelete(transactionId: number) {
    // TODO: Implementar eliminación de transacción
  }
}
