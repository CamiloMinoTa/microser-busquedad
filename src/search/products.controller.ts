import { Controller, Get, Inject, Param } from '@nestjs/common';
import { GetProductByIdUseCase } from '../application/use-cases/get-product-by-id.use-case';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case';
import type { Product } from '../domain/entities/product.entity';

type ListProductsExecutor = {
  execute(): Promise<ReadonlyArray<Product>>;
};

type GetProductByIdExecutor = {
  execute(productId: string): Promise<Product>;
};

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(ListProductsUseCase)
    private readonly listProductsUseCase: ListProductsExecutor,
    @Inject(GetProductByIdUseCase)
    private readonly getProductByIdUseCase: GetProductByIdExecutor,
  ) {}

  @Get()
  findAll(): Promise<ReadonlyArray<Product>> {
    return this.listProductsUseCase.execute();
  }

  @Get(':id')
  findById(@Param('id') productId: string): Promise<Product> {
    return this.getProductByIdUseCase.execute(productId);
  }
}
