
import { Expense } from '../domain/expense.entity';
import { IExpenseRepository } from '../domain/expense.repository';

export class AddExpenseUseCase {
  constructor(
    private expenseRepository: IExpenseRepository
  ) {}

  async execute(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    return this.expenseRepository.create(expense);
  }
}
