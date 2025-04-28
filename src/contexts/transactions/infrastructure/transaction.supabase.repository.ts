import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { TransactionRepository } from '../domain/transaction.repository';
import { Transaction } from '../domain/transaction.entity';
import { AddTransactionRequest } from './add-transaction.request';
import { UpdateTransactionRequest } from './update-transaction.request';

@Injectable({
  providedIn: 'root'
})
export class TransactionSupabaseRepository implements TransactionRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async addTransaction(
    type: 'income' | 'expense',
    amount: number,
    categoryId: number,
    date: string,
    description: string,
    userId: string
  ): Promise<Transaction> {
    const request: AddTransactionRequest = {
      type,
      amount,
      category_id: categoryId,
      date,
      description,
      user_id: userId
    };
    const { data, error } = await this.supabase
      .from('transactions')
      .insert(request)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTransaction(
    id: number,
    type: 'income' | 'expense',
    amount: number,
    categoryId: number,
    date: string,
    description: string
  ): Promise<Transaction> {
    const updateData: UpdateTransactionRequest = {
      type,
      amount,
      category_id: categoryId,
      date,
      description
    };
    const { data, error } = await this.supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTransaction(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getTransactionsByMonth(
    userId: string,
    month: string,
    type: 'income' | 'expense' | 'all' = 'all'
  ): Promise<Transaction[]> {
    const [year, monthNum] = month.split('-').map(Number);
    const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
    const nextYear = monthNum === 12 ? year + 1 : year;
    const nextMonthStr = String(nextMonth).padStart(2, '0');
    const nextMonthFirstDay = `${nextYear}-${nextMonthStr}-01`;
    let query = this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', `${month}-01`)
      .lt('date', nextMonthFirstDay);

    if (type !== 'all') {
      query = query.eq('type', type);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return data;
  }
}
