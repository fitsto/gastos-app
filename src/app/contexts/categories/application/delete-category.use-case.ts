import { ICategoryRepository } from '../domain/category.repository';

export class DeleteCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
