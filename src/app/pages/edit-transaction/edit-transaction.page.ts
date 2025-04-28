import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ChileanCurrencyPipe } from '../../shared/pipes/chilean-currency.pipe';
import { TransactionSupabaseRepository } from 'src/contexts/transactions/infrastructure/transaction.supabase.repository';
import { UpdateTransactionUseCase } from 'src/contexts/transactions/application/update-transaction.use-case';
import { GetAllCategoriesUseCase } from 'src/contexts/categories/application/get-all-categories.use-case';
import { Category } from 'src/contexts/categories/domain/category.entity';
import { AuthSupabaseRepository } from 'src/contexts/auth/infrastructure/auth.supabase.repository';
import { GetCurrentUserIdUseCase } from 'src/contexts/auth/application/get-current-user-id.use-case';
import { CategorySupabaseRepository } from 'src/contexts/categories/infrastructure/category.supabase.repository';

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, ChileanCurrencyPipe],
  templateUrl: './edit-transaction.page.html',
  styleUrls: ['./edit-transaction.page.scss']
})
export class EditTransactionPage implements OnInit {
  transactionForm: FormGroup;
  transactionId: string = '';
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  private transactionRepository = inject(TransactionSupabaseRepository);
  private categoryRepository = inject(CategorySupabaseRepository);
  private authRepository = inject(AuthSupabaseRepository);
  showRawAmount = false;
  chileanCurrencyPipe = new ChileanCurrencyPipe();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.transactionForm = this.formBuilder.group({
      type: ['expense', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      date: [new Date().toISOString(), Validators.required],
      description: ['']
    });
  }

  async ngOnInit() {
    this.transactionId = this.route.snapshot.paramMap.get('id') || '';
    await this.loadCategories();
    if (this.transactionId) {
      const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
      const userId = await getCurrentUserIdUseCase.execute();
      const transactions = await this.transactionRepository.getTransactionsByMonth(
        userId,
        new Date().toISOString().split('-')[0] + '-' + new Date().toISOString().split('-')[1]
      );
      const transaction = transactions.find(t => t.id === Number(this.transactionId));

      if (transaction) {
        this.transactionForm.patchValue({
          type: transaction.type,
          amount: transaction.amount,
          categoryId: transaction.categoryId,
          date: transaction.date,
          description: transaction.description || ''
        });
        this.filterCategories();
      }
    }
  }

  async loadCategories() {
    const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
    const userId = await getCurrentUserIdUseCase.execute();
    this.categories = await this.categoryRepository.findAll(userId);
    this.filterCategories();
  }

  filterCategories() {
    const type = this.transactionForm.get('type')?.value;
    this.filteredCategories = this.categories;
  }

  async onSubmit() {
    if (this.transactionForm.valid && this.transactionId) {
      try {
        const { type, amount, categoryId, date, description } = this.transactionForm.value;
        const updateTransactionUseCase = new UpdateTransactionUseCase(this.transactionRepository);
        await updateTransactionUseCase.execute(
          Number(this.transactionId),
          type,
          Number(amount),
          Number(categoryId),
          date,
          description || ''
        );
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al actualizar la transacción:', error);
      }
    }
  }

  onAmountBlur() {
    this.showRawAmount = false;
    const value = this.transactionForm.get('amount')?.value;
    if (value !== null && value !== undefined && value !== '') {
      this.transactionForm.get('amount')?.setValue(Number(value));
    }
  }

  onAmountFocus() {
    this.showRawAmount = true;
  }

  get formattedAmount(): string {
    const value = this.transactionForm.get('amount')?.value;
    if (value === null || value === undefined || value === '') return '';
    return this.chileanCurrencyPipe.transform(value);
  }
}
