// src/domain/use-cases/get-products-by-category.use-case.ts

import { SearchRepositoryPort } from '../ports/search.repository';
import { ProductEntity } from '../entities/product.entity';
import { Category } from '../value-objects/category.value-object';

export interface GetProductsByCategoryRequest {
  category: string;
  limit?: number;
  offset?: number;
}

export interface GetProductsByCategoryResponse {
  products: ProductEntity[];
  total: number;
  category: string;
}

export class GetProductsByCategoryUseCase {
  constructor(private readonly searchRepository: SearchRepositoryPort) {}

  async execute(request: GetProductsByCategoryRequest): Promise<GetProductsByCategoryResponse> {
    // Validar categoría
    const category = new Category(request.category);
    
    const limit = request.limit || 20;
    const offset = request.offset || 0;

    // Obtener productos por categoría
    const products = await this.searchRepository.getProductsByCategory(
      category,
      limit,
      offset
    );

    const total = await this.searchRepository.countByCategory(category);

    return {
      products,
      total,
      category: category.toString()
    };
  }
}