import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Transaction } from 'src/contexts/transactions/domain/transaction.entity';

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class TransactionCardComponent {
  @Input() transaction!: Transaction;
  @Input() categoryName: string = '';

  get amountColor(): string {
    return this.transaction.type === 'income' ? 'success' : 'danger';
  }

  get amountPrefix(): string {
    return this.transaction.type === 'income' ? '+' : '-';
  }
}
