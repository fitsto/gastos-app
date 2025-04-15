import { Category } from '../domain/category.entity';
import { ICategoryRepository } from '../domain/category.repository';

export class GetAllCategoriesUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(userId: string): Promise<Category[]> {
    return await this.categoryRepository.findAll(userId);
  }
}
