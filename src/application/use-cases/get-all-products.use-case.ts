import { Inject, Injectable } from '@nestjs/common';
import type { Product } from '../../domain/entities/product.entity';
import {
  PRODUCT_READER,
  type ProductReader,
} from '../../domain/ports/product-reader.port';

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject(PRODUCT_READER)
    private readonly productReader: ProductReader,
  ) {}

  execute(): Promise<ReadonlyArray<Product>> {
    return this.productReader.findAll();
  }
}
