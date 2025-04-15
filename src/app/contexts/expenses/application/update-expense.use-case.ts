
import { IExpenseRepository } from '../domain/expense.repository';
import { Expense } from '../domain/expense.entity';


export class UpdateExpenseUseCase {
  constructor(
    private expenseRepository: IExpenseRepository
  ) {}

  async execute(id: string, expense: Partial<Expense>): Promise<Expense> {
    return await this.expenseRepository.update(id, expense);
  }
}
