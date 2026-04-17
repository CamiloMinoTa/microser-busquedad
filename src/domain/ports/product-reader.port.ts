import type { Product } from '../entities/product.entity';

export const PRODUCT_READER = Symbol('PRODUCT_READER');

export interface ProductReader {
  findAll(): Promise<ReadonlyArray<Product>>;
  findById(productId: string): Promise<Product | null>;
}
