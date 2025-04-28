import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  ModalController,
  ToastController
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  pencilOutline,
  trashOutline,
  folderOutline
} from 'ionicons/icons';
import { CategoryFormModalComponent } from './components/category-form-modal/category-form-modal.component';
import { AuthSupabaseRepository } from 'src/contexts/auth/infrastructure/auth.supabase.repository';
import { CategorySupabaseRepository } from 'src/contexts/categories/infrastructure/category.supabase.repository';
import { Category } from 'src/contexts/categories/domain/category.entity';
import { GetCurrentUserIdUseCase } from 'src/contexts/auth/application/get-current-user-id.use-case';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonButtons,
    IonBackButton
  ]
})
export class CategoriesPage implements OnInit {
  private categoryRepository = inject(CategorySupabaseRepository);
  private authRepository = inject(AuthSupabaseRepository);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

  categories: Category[] = [];

  constructor() {
    addIcons({
      addCircleOutline,
      pencilOutline,
      trashOutline,
      folderOutline
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
    const userId = await getCurrentUserIdUseCase.execute();
    this.categories = await this.categoryRepository.findAll(userId);
  }

  async handleEdit(category: Category) {
    const modal = await this.modalCtrl.create({
      component: CategoryFormModalComponent,
      componentProps: {
        category
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      try {
        await this.categoryRepository.update(category.id, {
          ...category,
          ...data
        });
        await this.loadCategories();
        this.showToast('Categoría actualizada correctamente');
      } catch (error) {
        console.error('Error al actualizar categoría:', error);
        this.showToast('Error al actualizar la categoría', 'danger');
      }
    }
  }

  async handleDelete(categoryId: number) {
    try {
      await this.categoryRepository.delete(categoryId);
      this.categories = this.categories.filter(c => c.id !== categoryId);
      this.showToast('Categoría eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      this.showToast('Error al eliminar la categoría', 'danger');
    }
  }

  async showAddCategoryModal() {
    const modal = await this.modalCtrl.create({
      component: CategoryFormModalComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      try {
        const getCurrentUserIdUseCase = new GetCurrentUserIdUseCase(this.authRepository);
        const userId = await getCurrentUserIdUseCase.execute();
        await this.categoryRepository.create({
          ...data,
          user_id: userId,
          is_default: false
        });
        await this.loadCategories();
        this.showToast('Categoría creada correctamente');
      } catch (error) {
        console.error('Error al crear categoría:', error);
        this.showToast('Error al crear la categoría', 'danger');
      }
    }
  }

  private async showToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }
}
