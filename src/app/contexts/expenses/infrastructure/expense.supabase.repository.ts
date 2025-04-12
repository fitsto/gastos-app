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
      .insert([expense])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, expense: Partial<Expense>): Promise<Expense> {
    const { data, error } = await this.supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByMonth(userId: string, year: number, month: number): Promise<Expense[]> {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();

    const { data, error } = await this.supabase
      .from('expenses')
      .select()
      .eq('userId', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;
    return data || [];
  }

  async findAll(userId: string): Promise<Expense[]> {
    const { data, error } = await this.supabase
      .from('expenses')
      .select()
      .eq('userId', userId);

    if (error) throw error;
    return data || [];
  }
}
