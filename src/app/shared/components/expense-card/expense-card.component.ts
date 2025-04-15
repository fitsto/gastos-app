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

  getCategoryColor(categoryId: number): string {
    const colors: { [key: number]: string } = {
      1: '#4CAF50', // Alimentación
      2: '#2196F3', // Transporte
      3: '#FFC107', // Entretenimiento
      4: '#9C27B0', // Servicios
      5: '#757575'  // Otros
    };
    return colors[categoryId] || colors[5];
  }
}
