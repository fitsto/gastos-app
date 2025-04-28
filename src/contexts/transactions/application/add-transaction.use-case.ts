import { Injectable } from '@angular/core';import { Transaction } from '../domain/transaction.entity';
import { TransactionRepository } from '../domain/transaction.repository';


export class AddTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  execute(
    type: 'income' | 'expense',
    amount: number,
    categoryId: number,
    date: string,
    description: string,
    userId: string
  ): Promise<Transaction> {
    // Validaciones
    if (!type || !['income', 'expense'].includes(type)) {
      throw new Error('Tipo de transacción inválido');
    }
    if (!amount || amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    if (!categoryId) {
      throw new Error('La categoría es obligatoria');
    }
    if (!date) {
      throw new Error('La fecha es obligatoria');
    }

    return this.transactionRepository.addTransaction(
      type,
      amount,
      categoryId,
      date,
      description || '',
      userId
    );
  }
}
