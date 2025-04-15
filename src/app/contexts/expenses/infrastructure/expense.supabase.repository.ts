import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Expense } from '../domain/expense.entity';
import { IExpenseRepository } from '../domain/expense.repository';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseSupabaseRepository implements IExpenseRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async create(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const { data, error } = await this.supabase
      .from('expenses')
      .insert([{
        user_id: expense.userId,
        category_id: expense.categoryId,
        amount: expense.amount,
        description: expense.description,
        date: expense.date
      }])
      .select('id, user_id, category_id, amount, description, date, created_at, updated_at')
      .single();

    if (error) throw error;
    return this.mapToExpense(data);
  }

  async update(id: string, expense: Partial<Expense>): Promise<Expense> {
    const { data, error } = await this.supabase
      .from('expenses')
      .update({
        category_id: expense.categoryId,
        amount: expense.amount,
        description: expense.description,
        date: expense.date
      })
      .eq('id', id)
      .select('id, user_id, category_id, amount, description, date, created_at, updated_at')
      .single();

    if (error) throw error;
    return this.mapToExpense(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async findById(id: string): Promise<Expense | null> {
    const { data, error } = await this.supabase
      .from('expenses')
      .select('id, user_id, category_id, amount, description, date, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? this.mapToExpense(data) : null;
  }

  async findByMonth(userId: string, year: number, month: number): Promise<Expense[]> {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();

    const { data, error } = await this.supabase
      .from('expenses')
      .select('id, user_id, category_id, amount, description, date, created_at, updated_at')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;
    return (data || []).map(this.mapToExpense);
  }

  async findAll(userId: string): Promise<Expense[]> {
    const { data, error } = await this.supabase
      .from('expenses')
      .select('id, user_id, category_id, amount, description, date, created_at, updated_at')
      .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map(this.mapToExpense);
  }

  private mapToExpense(data: any): Expense {
    return {
      id: data.id,
      userId: data.user_id,
      categoryId: data.category_id,
      amount: data.amount,
      description: data.description,
      date: new Date(data.date),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}
