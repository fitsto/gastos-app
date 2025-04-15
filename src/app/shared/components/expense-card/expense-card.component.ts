import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Expense } from '../../../contexts/expenses/domain/expense.entity';

@Component({
  selector: 'app-expense-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './expense-card.component.html',
  styleUrls: ['./expense-card.component.scss']
})
export class ExpenseCardComponent {
  @Input() expense!: Expense;
  @Input() categoryName: string = '';
  @Output() edit = new EventEmitter<Expense>();
  @Output() delete = new EventEmitter<string>();

  getCategoryColor(categoryId: string): string {
    const colors: { [key: string]: string } = {
      'food': '#4CAF50',
      'transport': '#2196F3',
      'entertainment': '#FFC107',
      'bills': '#9C27B0',
      'other': '#757575'
    };
    return colors[categoryId] || colors['other'];
  }
}
