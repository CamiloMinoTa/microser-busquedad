// src/domain/ports/search.repository.ts

import { ProductEntity } from '../entities/product.entity';
import { SearchQuery } from '../value-objects/search-query.value-object';
import { Category } from '../value-objects/category.value-object';

export interface SearchRepositoryPort {
  // Búsqueda por texto
  searchProducts(
    query: SearchQuery,
    category: Category | undefined,
    limit: number,
    offset: number
  ): Promise<ProductEntity[]>;

  // Contar resultados de búsqueda
  countProducts(
    query: SearchQuery,
    category: Category | undefined
  ): Promise<number>;

  // Obtener producto por ID
  getProductById(id: string): Promise<ProductEntity | null>;

  // Obtener productos por categoría
  getProductsByCategory(
    category: Category,
    limit: number,
    offset: number
  ): Promise<ProductEntity[]>;

  // Contar productos por categoría
  countByCategory(category: Category): Promise<number>;
}