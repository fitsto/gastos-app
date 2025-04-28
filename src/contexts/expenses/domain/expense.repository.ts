import { Expense } from './expense.entity';

export interface IExpenseRepository {
  create(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense>;
  update(id: string, expense: Partial<Expense>): Promise<Expense>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Expense | null>;
  findByMonth(userId: string, year: number, month: number): Promise<Expense[]>;
  findAll(userId: string): Promise<Expense[]>;
}
