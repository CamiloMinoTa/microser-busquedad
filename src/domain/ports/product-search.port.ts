import type { Product } from '../entities/product.entity';
import type { SearchQuery } from '../value-objects/search-query.value-object';

export const PRODUCT_SEARCH = Symbol('PRODUCT_SEARCH');

export interface ProductSearch {
  search(query: SearchQuery): Promise<ReadonlyArray<Product>>;
}
