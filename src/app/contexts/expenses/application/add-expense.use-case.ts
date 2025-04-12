import { Injectable, Inject } from '@angular/core';
import { Expense } from '../domain/expense.entity';
import { ExpenseRepository, IExpenseRepository } from '../domain/expense.repository';

@Injectable({
  providedIn: 'root'
})
export class AddExpenseUseCase {
  constructor(
    @Inject(ExpenseRepository) private expenseRepository: IExpenseRepository
  ) {}

  async execute(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    return this.expenseRepository.create(expense);
  }
}
