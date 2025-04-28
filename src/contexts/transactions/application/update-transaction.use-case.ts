import { TransactionRepository } from '../domain/transaction.repository';
import { Transaction } from '../domain/transaction.entity';

export class UpdateTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository
  ) {}

  async execute(
    id: number,
    type: 'income' | 'expense',
    amount: number,
    categoryId: number,
    date: string,
    description: string
  ): Promise<Transaction> {
    return await this.transactionRepository.updateTransaction(
      id,
      type,
      amount,
      categoryId,
      date,
      description
    );
  }
}
