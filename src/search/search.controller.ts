import {
  Controller,
  DefaultValuePipe,
  Inject,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AutocompleteUseCase } from '../application/use-cases/autocomplete.use-case';
import { SearchProductsDto } from '../application/dtos/search-products.dto';
import { SearchProductsUseCase } from '../application/use-cases/search-products.use-case';
import type { Product } from '../domain/entities/product.entity';

type SearchProductsExecutor = {
  execute(request?: SearchProductsDto): Promise<ReadonlyArray<Product>>;
};

type AutocompleteExecutor = {
  execute(rawQuery?: string, limit?: number): Promise<ReadonlyArray<string>>;
};

@Controller('search')
export class SearchController {
  constructor(
    @Inject(SearchProductsUseCase)
    private readonly searchProductsUseCase: SearchProductsExecutor,
    @Inject(AutocompleteUseCase)
    private readonly autocompleteUseCase: AutocompleteExecutor,
  ) {}

  @Get()
  search(@Query() query: SearchProductsDto): Promise<ReadonlyArray<Product>> {
    return this.searchProductsUseCase.execute(query);
  }

  @Get('autocomplete')
  autocomplete(
    @Query('q') query = '',
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ): Promise<ReadonlyArray<string>> {
    return this.autocompleteUseCase.execute(query, limit);
  }
}
