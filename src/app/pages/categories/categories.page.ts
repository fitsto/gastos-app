import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../contexts/categories/domain/category.entity';
import { ToastController } from '@ionic/angular';
import { GetCurrentUserIdUseCase } from '../../contexts/auth/application/get-current-user-id.use-case';
import { GetAllCategoriesUseCase } from '../../contexts/categories/application/get-all-categories.use-case';
import { CreateCategoryUseCase } from '../../contexts/categories/application/create-category.use-case';
import { DeleteCategoryUseCase } from '../../contexts/categories/application/delete-category.use-case';
import { CategoryRepository } from '../../contexts/categories/domain/category.repository';
import { CategorySupabaseRepository } from '../../contexts/categories/infrastructure/category.supabase.repository';
import { AuthSupabaseRepository } from 'src/app/contexts/auth/infrastructure/auth.supabase.repository';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  providers: [
  ],
  templateUrl: './categories.page.html'
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private authSupabaseRepository: AuthSupabaseRepository,
    private categoryRepository: CategorySupabaseRepository
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      color: ['#3880ff', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  async getCurrentUserId() {
    const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authSupabaseRepository);
    const userId = await getCurrentUserIdUseCase.execute();
    return userId;
  }

  async loadCategories() {
    try {
      this.isLoading = true;
      const userId = await this.getCurrentUserId();
      const getAllCategoriesUseCase = new GetAllCategoriesUseCase(this.categoryRepository);
      this.categories = await getAllCategoriesUseCase.execute(userId);
    } catch (error) {
      const err = error as Error;
      await this.showToast(err.message || 'Error al cargar categorías', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (this.categoryForm.valid) {
      try {
        const userId = await this.getCurrentUserId();
        const categoryData = {
          ...this.categoryForm.value,
          user_id: userId,
          is_default: false
        };

        const createCategoryUseCase = new CreateCategoryUseCase(this.categoryRepository);
        await createCategoryUseCase.execute(categoryData);
        this.categoryForm.reset({ color: '#3880ff' });
        this.loadCategories();
      } catch (error) {
        const err = error as Error;
        await this.showToast(err.message || 'Error al crear categoría', 'danger');
      }
    }
  }

  async handleDelete(id: number) {
    try {
      const category = this.categories.find(c => c.id === id);
      if (!category) {
        throw new Error('Categoría no encontrada');
      }
      const deleteCategoryUseCase = new DeleteCategoryUseCase(this.categoryRepository);
      await deleteCategoryUseCase.execute(id);
      this.categories = this.categories.filter(category => category.id !== id);
      await this.showToast('Categoría eliminada exitosamente', 'success');
    } catch (error) {
      const err = error as Error;
      await this.showToast(err.message || 'Error al eliminar categoría', 'danger');
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
