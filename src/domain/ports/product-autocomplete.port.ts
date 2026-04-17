import type { SearchQuery } from '../value-objects/search-query.value-object';

export const PRODUCT_AUTOCOMPLETE = Symbol('PRODUCT_AUTOCOMPLETE');

export interface ProductAutocomplete {
  autocomplete(
    query: SearchQuery,
    limit?: number,
  ): Promise<ReadonlyArray<string>>;
}
