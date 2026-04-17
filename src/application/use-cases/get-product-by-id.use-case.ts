import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Product } from '../../domain/entities/product.entity';
import {
  PRODUCT_READER,
  type ProductReader,
} from '../../domain/ports/product-reader.port';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_READER)
    private readonly productReader: ProductReader,
  ) {}

  async execute(productId: string): Promise<Product> {
    const normalizedId = productId.trim();

    if (!normalizedId) {
      throw new BadRequestException('El id del producto es obligatorio.');
    }

    const product = await this.productReader.findById(normalizedId);

    if (!product) {
      throw new NotFoundException(
        `No se encontro un producto con id "${normalizedId}".`,
      );
    }

    return product;
  }
}
