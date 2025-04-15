import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Expense } from '../domain/expense.entity';
import { IExpenseRepository } from '../domain/expense.repository';
import { environment } from '../../../../environments/environment';

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

  async create(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const { data, error } = await this.supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();

    if (error) throw error;
    return this.mapToExpense(data);
  }

  async update(id: string, expense: Partial<Expense>): Promise<Expense> {
    const { data, error } = await this.supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .select()
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
      .select('*')
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
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapToExpense);
  }

  async findAll(userId: string): Promise<Expense[]> {
    console.log('userId', userId);
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
      amount: data.amount,
      categoryId: data.category_id,
      date: data.date,
      description: data.description || '',
      userId: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
}
