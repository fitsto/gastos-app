import { Component, OnInit, Inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../contexts/categories/domain/category.entity';
import { CategoryRepository, ICategoryRepository } from '../../contexts/categories/domain/category.repository';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Categorías</ion-title>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <!-- Formulario de nueva categoría -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Nueva Categoría</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
              <ion-item>
                <ion-label position="floating">Nombre</ion-label>
                <ion-input
                  formControlName="name"
                  placeholder="Ej: Alimentación"
                ></ion-input>
              </ion-item>
              <ion-text color="danger" *ngIf="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched">
                <p>El nombre es requerido</p>
              </ion-text>

              <ion-item>
                <ion-label position="floating">Color</ion-label>
                <ion-input
                  type="color"
                  formControlName="color"
                ></ion-input>
              </ion-item>

              <ion-button
                type="submit"
                expand="block"
                [disabled]="categoryForm.invalid"
                class="ion-margin-top"
              >
                Agregar Categoría
              </ion-button>
            </form>
          </ion-card-content>
        </ion-card>

        <!-- Lista de categorías -->
        <ion-list>
          <ion-item-group>
            <ion-item-divider>
              <ion-label>Categorías Existentes</ion-label>
            </ion-item-divider>

            <ion-item *ngFor="let category of categories">
              <ion-label>
                <h2>{{ category.name }}</h2>
              </ion-label>
              <ion-button
                fill="clear"
                color="danger"
                slot="end"
                (click)="handleDelete(category.id)"
              >
                <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-item-group>
        </ion-list>

        <!-- Estado vacío -->
        <div *ngIf="categories.length === 0" class="app-empty-state">
          <ion-icon name="folder-outline" size="large"></ion-icon>
          <h2>No hay categorías</h2>
          <p>Agrega tu primera categoría para comenzar</p>
        </div>
      </div>
    </ion-content>
  `
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(CategoryRepository) private categoryRepository: ICategoryRepository
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      color: ['#3880ff', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    // TODO: Obtener el userId del servicio de autenticación
    const userId = 'current-user-id';
    this.categories = await this.categoryRepository.findAll(userId);
  }

  async onSubmit() {
    if (this.categoryForm.valid) {
      try {
        const categoryData = {
          ...this.categoryForm.value,
          userId: 'current-user-id' // TODO: Obtener del servicio de autenticación
        };

        await this.categoryRepository.create(categoryData);
        this.categoryForm.reset({ color: '#3880ff' });
        this.loadCategories();
      } catch (error) {
        console.error('Error al crear categoría:', error);
        // TODO: Mostrar mensaje de error al usuario
      }
    }
  }

  async handleDelete(id: string) {
    try {
      await this.categoryRepository.delete(id);
      this.categories = this.categories.filter(category => category.id !== id);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      // TODO: Mostrar mensaje de error al usuario
    }
  }
}