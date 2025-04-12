import { Category } from './category.entity';

export interface ICategoryRepository {
  create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category>;
  findAll(userId: string): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  update(id: string, category: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;
}

export const CategoryRepository = Symbol('CategoryRepository');