import { Module } from '@nestjs/common';
import { AutocompleteUseCase } from '../application/use-cases/autocomplete.use-case';
import { FilterProductsUseCase } from '../application/use-cases/filter-products.use-case';
import { GetAllProductsUseCase } from '../application/use-cases/get-all-products.use-case';
import { GetProductByIdUseCase } from '../application/use-cases/get-product-by-id.use-case';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case';
import { SearchProductsUseCase } from '../application/use-cases/search-products.use-case';
import { PRODUCT_AUTOCOMPLETE } from '../domain/ports/product-autocomplete.port';
import { PRODUCT_READER } from '../domain/ports/product-reader.port';
import { PRODUCT_REPOSITORY } from '../domain/ports/product.repository';
import { PRODUCT_SEARCH } from '../domain/ports/product-search.port';
import { MongoAtlasProductRepository } from '../infrastructure/repositories/mongo-atlas-product.repository';
import { ProductsController } from './products.controller';
import { SearchController } from './search.controller';

@Module({
  controllers: [ProductsController, SearchController],
  providers: [
    AutocompleteUseCase,
    FilterProductsUseCase,
    GetAllProductsUseCase,
    GetProductByIdUseCase,
    ListProductsUseCase,
    SearchProductsUseCase,
    MongoAtlasProductRepository,
    {
      provide: PRODUCT_REPOSITORY,
      useExisting: MongoAtlasProductRepository,
    },
    {
      provide: PRODUCT_READER,
      useExisting: PRODUCT_REPOSITORY,
    },
    {
      provide: PRODUCT_SEARCH,
      useExisting: PRODUCT_REPOSITORY,
    },
    {
      provide: PRODUCT_AUTOCOMPLETE,
      useExisting: PRODUCT_REPOSITORY,
    },
  ],
})
export class SearchModule {}
