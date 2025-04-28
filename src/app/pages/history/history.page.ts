import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';
import { Router } from '@angular/router';
import { ExpenseCardComponent } from '../../shared/components/expense-card/expense-card.component';
import { CategoryChipComponent } from '../../shared/components/category-chip/category-chip.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

import { MonthYearPipe } from '../../shared/pipes/month-year.pipe';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { ChileanCurrencyPipe } from '../../shared/pipes/chilean-currency.pipe';
import { Expense } from 'src/contexts/expenses/domain/expense.entity';
import { ExpenseSupabaseRepository } from 'src/contexts/expenses/infrastructure/expense.supabase.repository';
import { CategorySupabaseRepository } from 'src/contexts/categories/infrastructure/category.supabase.repository';
import { AuthSupabaseRepository } from 'src/contexts/auth/infrastructure/auth.supabase.repository';
import { Category } from 'src/contexts/categories/domain/category.entity';
import { GetCurrentUserIdUseCase } from 'src/contexts/auth/application/get-current-user-id.use-case';

interface ExpenseGroup {
  date: string;
  total: number;
  expenses: Expense[];
}

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpenseCardComponent,
    CategoryChipComponent,
    EmptyStateComponent,
    MonthYearPipe,
    ChileanCurrencyPipe
  ]
})
export class HistoryPage implements OnInit {
  @ViewChild('dateModal') dateModal!: IonModal;

  private router = inject(Router);
  private expenseRepository = inject(ExpenseSupabaseRepository);
  private categoryRepository = inject(CategorySupabaseRepository);
  private authRepository = inject(AuthSupabaseRepository);

  selectedMonth = new Date().toISOString();
  selectedCategory = 0;
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  groupedExpenses: ExpenseGroup[] = [];
  filteredTotal = 0;
  categories: Category[] = [];
  userId: string = '';
  showCategoryPopover = false;

  constructor() {
    addIcons({ add });
  }

  async ngOnInit() {
    await this.loadUserId();
    await this.loadCategories();
    await this.loadExpenses();
  }

  async loadUserId() {
    const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
    this.userId = await getCurrentUserIdUseCase.execute();
  }

  async loadCategories() {
    try {
      this.categories = await this.categoryRepository.findAll(this.userId);
      // Evitar duplicados de la opción 'Todas'
      if (!this.categories.some(c => c.id === 0)) {
        this.categories.unshift({
          id: 0,
          name: 'Todos',
          color: '#92949c', // Color medium de Ionic
          user_id: this.userId,
          is_default: true
        });
      }
      console.log({categories: this.categories});
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  async loadExpenses() {
    const date = new Date(this.selectedMonth);
    this.expenses = await this.expenseRepository.findByMonth(
      this.userId,
      date.getFullYear(),
      date.getMonth() + 1
    );
    this.applyFilters();
  }

  applyFilters() {
    // Filtrar por categoría
    this.filteredExpenses = this.selectedCategory
      ? this.expenses.filter(expense => Number(expense.categoryId) === this.selectedCategory)
      : [...this.expenses];

    // Calcular total
    this.filteredTotal = this.filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    // Agrupar por fecha
    const groups = this.filteredExpenses.reduce((acc, expense) => {
      const date = new Date(expense.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          total: 0,
          expenses: []
        };
      }
      acc[date].expenses.push(expense);
      acc[date].total += expense.amount;
      return acc;
    }, {} as { [key: string]: ExpenseGroup });

    // Convertir a array y ordenar por fecha descendente
    this.groupedExpenses = Object.values(groups).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  selectCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  async onDateChange(event: any) {
    this.selectedMonth = event.detail.value;
    await this.loadExpenses();
    this.dateModal.dismiss();
  }

  openDatePicker() {
    this.dateModal.present();
  }

  getCategoryName(categoryId: number): string {
    console.log({categoryId, categories: this.categories})
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

  getCategoryColor(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.color : '#757575'; // gris
  }

  getCategory(categoryId: number): Category | undefined {
    return this.categories.find(c => c.id === categoryId);
  }

  async handleEdit(expense: Expense) {
    this.router.navigate(['/edit-expense', expense.id]);
  }

  async handleDelete(expenseId: string) {
    try {
      await this.expenseRepository.delete(expenseId);
      this.expenses = this.expenses.filter(e => e.id !== expenseId);
      this.applyFilters();

      // Mostrar mensaje de éxito
      const toast = document.createElement('ion-toast');
      toast.message = 'Gasto eliminado correctamente';
      toast.duration = 2000;
      toast.position = 'bottom';
      toast.color = 'success';
      document.body.appendChild(toast);
      await toast.present();

    } catch (error) {
      console.error('Error al eliminar el gasto:', error);

      // Mostrar mensaje de error
      const toast = document.createElement('ion-toast');
      toast.message = 'Error al eliminar el gasto';
      toast.duration = 3000;
      toast.position = 'bottom';
      toast.color = 'danger';
      document.body.appendChild(toast);
      await toast.present();
    }
  }

  getSelectedCategoryName(): string {
    if (this.selectedCategory === 0) return 'Todos';
    const category = this.categories.find(c => c.id === this.selectedCategory);
    return category ? category.name : 'Todos';
  }
}
