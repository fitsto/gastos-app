import { InjectionToken } from '@angular/core';
import { Category } from './category.entity';

export interface ICategoryRepository {
  findAll(userId: string): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  create(category: Omit<Category, 'id'>): Promise<Category>;
  update(id: number, category: Partial<Category>): Promise<Category>;
  delete(id: number): Promise<void>;
}

export const CategoryRepository = new InjectionToken<ICategoryRepository>('CategoryRepository');
