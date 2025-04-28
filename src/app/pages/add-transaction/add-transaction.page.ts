import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonDatetime,
  IonButton,
  IonButtons,
  IonBackButton,
  IonText,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { Category } from 'src/contexts/categories/domain/category.entity';
import { AddTransactionUseCase } from 'src/contexts/transactions/application/add-transaction.use-case';
import { GetAllCategoriesUseCase } from 'src/contexts/categories/application/get-all-categories.use-case';
import { AuthSupabaseRepository } from 'src/contexts/auth/infrastructure/auth.supabase.repository';
import { GetCurrentUserIdUseCase } from 'src/contexts/auth/application/get-current-user-id.use-case';
import { CategorySupabaseRepository } from 'src/contexts/categories/infrastructure/category.supabase.repository';
import { TransactionSupabaseRepository } from 'src/contexts/transactions/infrastructure/transaction.supabase.repository';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.page.html',
  styleUrls: ['./add-transaction.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonDatetime,
    IonButton,
    IonButtons,
    IonBackButton,
    IonText
  ]
})
export class AddTransactionPage implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);
  private authRepository = inject(AuthSupabaseRepository);
  private categoryRepository = inject(CategorySupabaseRepository);
  private transactionRepository = inject(TransactionSupabaseRepository);
  transactionForm: FormGroup;
  categories: Category[] = [];
  filteredCategories: Category[] = [];

  constructor() {
    this.transactionForm = this.formBuilder.group({
      type: ['expense', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      description: [''],
      date: [new Date().toISOString(), Validators.required]
    });
  }

  async ngOnInit() {
    await this.loadCategories();
    this.filterCategories();
  }

  async loadCategories() {
    try {
      const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
      const userId = await getCurrentUserIdUseCase.execute();
      const getAllCategoriesUseCase = new GetAllCategoriesUseCase(this.categoryRepository);
      this.categories = await getAllCategoriesUseCase.execute(userId);
      this.filterCategories();
    } catch (error) {
      console.error('Error loading categories:', error);
      this.showError('Error al cargar las categorías');
    }
  }

  filterCategories() {
    const type = this.transactionForm.get('type')?.value;
    // Por ahora, todas las categorías son válidas para ambos tipos
    this.filteredCategories = this.categories;

    // Reset category if current selection is not valid for the new type
    const currentCategoryId = this.transactionForm.get('categoryId')?.value;
    if (currentCategoryId && !this.filteredCategories.find(cat => cat.id === currentCategoryId)) {
      this.transactionForm.patchValue({ categoryId: '' });
    }
  }

  async onSubmit() {
    if (this.transactionForm.valid) {
      try {
        const { type, amount, categoryId, date, description } = this.transactionForm.value;
        const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
        const userId = await getCurrentUserIdUseCase.execute();
        const addTransactionUseCase = new AddTransactionUseCase(this.transactionRepository);
        await addTransactionUseCase.execute(
          type,
          Number(amount),
          Number(categoryId),
          date,
          description || '',
          userId
        );
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al agregar la transacción:', error);
      }
    }
  }

  async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
