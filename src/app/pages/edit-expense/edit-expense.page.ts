import { Component, OnInit, Inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateExpenseUseCase } from '../../contexts/expenses/application/update-expense.use-case';
import { ExpenseSupabaseRepository } from '../../contexts/expenses/infrastructure/expense.supabase.repository';
import { inject } from '@angular/core';
import { Category } from '../../contexts/categories/domain/category.entity';
import { CategorySupabaseRepository } from '../../contexts/categories/infrastructure/category.supabase.repository';
import { AuthSupabaseRepository } from '../../contexts/auth/infrastructure/auth.supabase.repository';
import { GetCurrentUserIdUseCase } from '../../contexts/auth/application/get-current-user-id.use-case';
import { ChileanCurrencyPipe } from '../../shared/pipes/chilean-currency.pipe';

@Component({
  selector: 'app-edit-expense',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-expense.page.html',
  styleUrls: ['./edit-expense.page.scss']
})
export class EditExpensePage implements OnInit {
  expenseForm: FormGroup;
  expenseId: string = '';
  categories: Category[] = [];
  private expenseRepository = inject(ExpenseSupabaseRepository);
  private categoryRepository = inject(CategorySupabaseRepository);
  private authRepository = inject(AuthSupabaseRepository);
  showRawAmount = false;
  chileanCurrencyPipe = new ChileanCurrencyPipe();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.expenseForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      description: ['']
    });
  }

  async ngOnInit() {
    this.expenseId = this.route.snapshot.paramMap.get('id') || '';
    await this.loadCategories();
    if (this.expenseId) {
      const expense = await this.expenseRepository.findById(this.expenseId);
      if (expense) {
        this.expenseForm.patchValue({
          amount: expense.amount,
          categoryId: expense.categoryId,
          date: expense.date,
          description: expense.description
        });
      }
    }
  }

  async loadCategories() {
    const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
    const userId = await getCurrentUserIdUseCase.execute();
    this.categories = await this.categoryRepository.findAll(userId);
  }

  async onSubmit() {
    if (this.expenseForm.valid && this.expenseId) {
      try {
        const { amount, categoryId, date, description } = this.expenseForm.value;
        const updateExpenseUseCase = new UpdateExpenseUseCase(this.expenseRepository);
        await updateExpenseUseCase.execute(this.expenseId, {
          amount,
          categoryId,
          date,
          description
        });
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al actualizar el gasto:', error);
        // TODO: Mostrar mensaje de error al usuario
      }
    }
  }

  onAmountBlur() {
    this.showRawAmount = false;
    const value = this.expenseForm.get('amount')?.value;
    if (value !== null && value !== undefined && value !== '') {
      // Solo formatear visualmente, el valor en el form sigue siendo numérico
      this.expenseForm.get('amount')?.setValue(Number(value));
    }
  }

  onAmountFocus() {
    this.showRawAmount = true;
  }

  get formattedAmount(): string {
    const value = this.expenseForm.get('amount')?.value;
    if (value === null || value === undefined || value === '') return '';
    return this.chileanCurrencyPipe.transform(value);
  }
}
