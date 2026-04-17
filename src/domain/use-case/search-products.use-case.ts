// src/domain/use-cases/search-products.use-case.ts

import { SearchRepositoryPort } from '../ports/search.repository';
import { ProductEntity } from '../entities/product.entity';
import { SearchQuery } from '../value-objects/search-query.value-object';
import { Category } from '../value-objects/category.value-object';

export interface SearchProductsRequest {
  query: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface SearchProductsResponse {
  products: ProductEntity[];
  total: number;
  hasMore: boolean;
}

export class SearchProductsUseCase {
  private static readonly DEFAULT_LIMIT = 20;
  private static readonly MAX_LIMIT = 100;

  constructor(private readonly searchRepository: SearchRepositoryPort) {}

  async execute(request: SearchProductsRequest): Promise<SearchProductsResponse> {
    // Validar y crear value objects
    const searchQuery = new SearchQuery(request.query);
    
    let category: Category | undefined;
    if (request.category) {
      category = new Category(request.category);
    }

    // Validar límites
    const limit = this.validateLimit(request.limit);
    const offset = request.offset || 0;

    // Ejecutar búsqueda en el repositorio
    const products = await this.searchRepository.searchProducts(
      searchQuery,
      category,
      limit,
      offset
    );

    // Obtener total (podría ser una llamada separada al repositorio)
    const total = await this.searchRepository.countProducts(searchQuery, category);

    return {
      products,
      total,
      hasMore: offset + products.length < total
    };
  }

  private validateLimit(limit?: number): number {
    if (!limit) return SearchProductsUseCase.DEFAULT_LIMIT;
    
    if (limit < 1) {
      throw new Error('Limit must be at least 1');
    }
    
    if (limit > SearchProductsUseCase.MAX_LIMIT) {
      throw new Error(`Limit cannot exceed ${SearchProductsUseCase.MAX_LIMIT}`);
    }
    
    return limit;
  }
}