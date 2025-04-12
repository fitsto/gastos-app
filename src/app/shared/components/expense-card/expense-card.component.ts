import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Expense } from '../../../contexts/expenses/domain/expense.entity';

@Component({
  selector: 'app-expense-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-subtitle>{{ categoryName }}</ion-card-subtitle>
        <ion-card-title>{{ expense.amount | currency }}</ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <p>{{ expense.description || 'Sin descripción' }}</p>
        <p class="date">{{ expense.date | date:'dd/MM/yyyy' }}</p>
      </ion-card-content>

      <ion-buttons>
        <ion-button fill="clear" (click)="onEdit.emit(expense)">
          <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
        </ion-button>
        <ion-button fill="clear" color="danger" (click)="onDelete.emit(expense.id)">
          <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-card>
  `,
  styles: [`
    .date {
      color: var(--ion-color-medium);
      font-size: 0.9em;
      margin-top: 8px;
    }

    ion-buttons {
      padding: 8px;
    }
  `]
})
export class ExpenseCardComponent {
  @Input() expense!: Expense;
  @Input() categoryName!: string;
  @Output() onEdit = new EventEmitter<Expense>();
  @Output() onDelete = new EventEmitter<string>();
}
