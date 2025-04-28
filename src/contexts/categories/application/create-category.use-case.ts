import { Category } from '../domain/category.entity';
import { ICategoryRepository } from '../domain/category.repository';

export interface CreateCategoryDTO {
  name: string;
  color: string;
  user_id: string;
  is_default: boolean;
}

export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(data: CreateCategoryDTO): Promise<Category> {
    return await this.categoryRepository.create(data);
  }
}
