// src/domain/use-cases/get-product-detail.use-case.ts

import { SearchRepositoryPort } from '../ports/search.repository';
import { ProductEntity } from '../entities/product.entity';
import { ProductId } from '../value-objects/product-id.value-object';

export interface GetProductDetailRequest {
  productId: string;
}

export interface GetProductDetailResponse {
  product: ProductEntity | null;
}

export class GetProductDetailUseCase {
  constructor(private readonly searchRepository: SearchRepositoryPort) {}

  async execute(request: GetProductDetailRequest): Promise<GetProductDetailResponse> {
    // Validar y crear value object
    const productId = new ProductId(request.productId);

    // Obtener producto del repositorio
    const product = await this.searchRepository.getProductById(productId.getValue());

    return {
      product
    };
  }
}