import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { ChileanCurrencyPipe } from '../../shared/pipes/chilean-currency.pipe';
import { ExpenseSupabaseRepository } from 'src/contexts/expenses/infrastructure/expense.supabase.repository';
import { CategorySupabaseRepository } from 'src/contexts/categories/infrastructure/category.supabase.repository';
import { AuthSupabaseRepository } from 'src/contexts/auth/infrastructure/auth.supabase.repository';
import { Category } from 'src/contexts/categories/domain/category.entity';
import { GetCurrentUserIdUseCase } from 'src/contexts/auth/application/get-current-user-id.use-case';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ChileanCurrencyPipe
  ],
  providers: [ChileanCurrencyPipe]
})
export class AddExpensePage implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private expenseRepository = inject(ExpenseSupabaseRepository);
  private categoryRepository = inject(CategorySupabaseRepository);
  private authRepository = inject(AuthSupabaseRepository);
  private chileanCurrencyPipe = inject(ChileanCurrencyPipe);

  expenseForm: FormGroup;
  categories: Category[] = [];
  loading = false;
  displayAmount: string = '';

  constructor() {
    this.expenseForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      description: ['']
    });

    // Suscribirse a los cambios del campo amount
    this.expenseForm.get('amount')?.valueChanges.subscribe((value: string | number) => {
      if (value) {
        // Eliminar puntos y convertir a número
        const numericValue = value.toString().replace(/\./g, '');
        if (!isNaN(parseFloat(numericValue))) {
          this.displayAmount = this.chileanCurrencyPipe.transform(numericValue);
          // Actualizar el valor del formulario sin formato
          this.expenseForm.patchValue({ amount: numericValue }, { emitEvent: false });
        }
      }
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
      const userId = await getCurrentUserIdUseCase.execute();
      this.categories = await this.categoryRepository.findAll(userId);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  onAmountInput(event: CustomEvent) {
    const value = (event.target as HTMLIonInputElement).value?.toString() || '';
    const numericValue = value.replace(/\./g, ''); // Eliminar puntos existentes
    if (numericValue) {
      this.displayAmount = this.chileanCurrencyPipe.transform(numericValue);
      // Actualizar el valor del formulario sin formato
      this.expenseForm.patchValue({ amount: numericValue }, { emitEvent: false });
    } else {
      this.displayAmount = '';
      this.expenseForm.patchValue({ amount: '' }, { emitEvent: false });
    }
  }

  async onSubmit() {
    if (this.expenseForm.valid) {
      this.loading = true;
      try {
        const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
        const userId = await getCurrentUserIdUseCase.execute();

        const formValue = this.expenseForm.value;
        const expenseData = {
          ...formValue,
          amount: parseFloat(formValue.amount || '0'),
          userId
        };

        await this.expenseRepository.create(expenseData);
        this.expenseForm.reset({
          amount: '',
          categoryId: '',
          date: new Date().toISOString(),
          description: ''
        });
        this.displayAmount = '';
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
