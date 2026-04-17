import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_AUTOCOMPLETE,
  type ProductAutocomplete,
} from '../../domain/ports/product-autocomplete.port';
import { SearchQuery } from '../../domain/value-objects/search-query.value-object';

@Injectable()
export class AutocompleteUseCase {
  constructor(
    @Inject(PRODUCT_AUTOCOMPLETE)
    private readonly productAutocomplete: ProductAutocomplete,
  ) {}

  async execute(rawQuery?: string, limit = 5): Promise<ReadonlyArray<string>> {
    const query = new SearchQuery(rawQuery);

    if (query.isEmpty) {
      return [];
    }

    return this.productAutocomplete.autocomplete(
      query,
      this.normalizeLimit(limit),
    );
  }

  private normalizeLimit(limit: number): number {
    const normalizedLimit = Number.isFinite(limit) ? Math.trunc(limit) : 5;
    return Math.min(Math.max(normalizedLimit, 1), 20);
  }
}
