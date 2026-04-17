import type { ProductAutocomplete } from './product-autocomplete.port';
import type { ProductReader } from './product-reader.port';
import type { ProductSearch } from './product-search.port';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository
  extends ProductReader, ProductSearch, ProductAutocomplete {}
