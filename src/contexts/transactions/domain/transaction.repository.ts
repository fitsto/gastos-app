import { Transaction } from './transaction.entity';

export interface TransactionRepository {
  addTransaction(
    type: 'income' | 'expense',
    amount: number,
    categoryId: number,
    date: string,
    description: string,
    userId: string
  ): Promise<Transaction>;
  updateTransaction(
    id: number,
    type: 'income' | 'expense',
    amount: number,
    categoryId: number,
    date: string,
    description: string
  ): Promise<Transaction>;
  deleteTransaction(id: number): Promise<void>;
  getTransactionsByMonth(userId: string, month: string, type?: 'income' | 'expense' | 'all'): Promise<Transaction[]>;
}
