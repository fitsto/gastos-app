import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  ModalController
} from '@ionic/angular/standalone';
import { Category } from 'src/contexts/categories/domain/category.entity';

@Component({
  selector: 'app-category-form-modal',
  templateUrl: './category-form-modal.component.html',
  styleUrls: ['./category-form-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons
  ]
})
export class CategoryFormModalComponent implements OnInit {
  @Input() category?: Category;
  categoryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      color: ['#3880ff', Validators.required]
    });
  }

  ngOnInit() {
    if (this.category) {
      this.categoryForm.patchValue({
        name: this.category.name,
        color: this.category.color
      });
    }
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.modalCtrl.dismiss(this.categoryForm.value);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
