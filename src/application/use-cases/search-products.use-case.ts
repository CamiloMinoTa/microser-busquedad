import { Inject, Injectable } from '@nestjs/common';
import type { Product } from '../../domain/entities/product.entity';
import {
  PRODUCT_READER,
  type ProductReader,
} from '../../domain/ports/product-reader.port';
import {
  PRODUCT_SEARCH,
  type ProductSearch,
} from '../../domain/ports/product-search.port';
import { SearchQuery } from '../../domain/value-objects/search-query.value-object';
import type { SearchProductsDto } from '../dtos/search-products.dto';

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject(PRODUCT_READER)
    private readonly productReader: ProductReader,
    @Inject(PRODUCT_SEARCH)
    private readonly productSearch: ProductSearch,
  ) {}

  execute(request: SearchProductsDto = {}): Promise<ReadonlyArray<Product>> {
    const query = new SearchQuery(request.q);

    if (query.isEmpty) {
      return this.productReader.findAll();
    }

    return this.productSearch.search(query);
  }
}
