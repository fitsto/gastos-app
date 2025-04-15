import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ExpenseSupabaseRepository } from '../../contexts/expenses/infrastructure/expense.supabase.repository';
import { CategorySupabaseRepository } from '../../contexts/categories/infrastructure/category.supabase.repository';
import { Category } from '../../contexts/categories/domain/category.entity';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class AddExpensePage implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private expenseRepository = inject(ExpenseSupabaseRepository);
  private categoryRepository = inject(CategorySupabaseRepository);

  expenseForm: FormGroup;
  categories: Category[] = [];
  loading = false;

  constructor() {
    this.expenseForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      description: ['']
    });
  }

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    try {
      // TODO: Obtener el userId del servicio de autenticación
      const userId = 'current-user-id';
      this.categories = await this.categoryRepository.findAll(userId);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  async onSubmit() {
    if (this.expenseForm.valid) {
      this.loading = true;
      try {
        const expenseData = {
          ...this.expenseForm.value,
          userId: 'current-user-id' // TODO: Obtener del servicio de autenticación
        };

        await this.expenseRepository.create(expenseData);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al crear el gasto:', error);
        // TODO: Mostrar mensaje de error al usuario
      } finally {
        this.loading = false;
      }
    }
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  getCategoryIcon(categoryName: string): string {
    const icons: { [key: string]: string } = {
      'Alimentación': 'restaurant-outline',
      'Transporte': 'car-outline',
      'Entretenimiento': 'game-controller-outline',
      'Servicios': 'receipt-outline',
      'Otros': 'ellipsis-horizontal-outline'
    };

    return icons[categoryName] || 'ellipsis-horizontal-outline';
  }
}
