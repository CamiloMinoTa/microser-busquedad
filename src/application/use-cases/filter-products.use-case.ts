import { Inject, Injectable } from '@nestjs/common';
import type { Product } from '../../domain/entities/product.entity';
import {
  PRODUCT_SEARCH,
  type ProductSearch,
} from '../../domain/ports/product-search.port';
import { SearchQuery } from '../../domain/value-objects/search-query.value-object';

@Injectable()
export class FilterProductsUseCase {
  constructor(
    @Inject(PRODUCT_SEARCH)
    private readonly productSearch: ProductSearch,
  ) {}

  execute(rawQuery?: string): Promise<ReadonlyArray<Product>> {
    return this.productSearch.search(new SearchQuery(rawQuery));
  }
}
