import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ChileanCurrencyPipe } from '../../pipes/chilean-currency.pipe';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { Expense } from 'src/contexts/expenses/domain/expense.entity';
import { Category } from 'src/contexts/categories/domain/category.entity';

@Component({
  selector: 'app-expense-card',
  standalone: true,
  imports: [CommonModule, IonicModule, ChileanCurrencyPipe],
  templateUrl: './expense-card.component.html',
  styleUrls: ['./expense-card.component.scss']
})
export class ExpenseCardComponent {
  @Input() expense!: Expense;
  @Input() category?: Category;
  @Output() edit = new EventEmitter<Expense>();
  @Output() delete = new EventEmitter<string>();

  constructor() {
    addIcons({ createOutline, trashOutline });
  }
}
