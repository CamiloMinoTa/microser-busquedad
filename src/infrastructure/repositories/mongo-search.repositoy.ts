import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchRepositoryPort } from '../../domain/ports/search.repository';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductDocument } from './schemas/product.schema';


import { SearchQuery } from '../../domain/value-objects/search-query.value-object';
import { Category } from '../../domain/value-objects/category.value-object';

@Injectable()
export class MongoSearchRepository implements SearchRepositoryPort {
  constructor(
    @InjectModel(ProductDocument.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  // ✅ FIRMA CORREGIDA: Ahora acepta SearchQuery y Category
  async searchProducts(
    query: SearchQuery, 
    category: Category | undefined, 
    limit: number, 
    offset: number
  ): Promise<ProductEntity[]> {
    

    const filter: any = { $text: { $search: query.toMongoTextSearch() } };
    
    // Si viene categoría, usamos getValue()
    if (category) {
      filter.category = category.getValue();
    }

    
    const docs = await this.productModel
      .find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(offset)
      .limit(limit)
      .exec();

    return docs.map(doc => this.mapToEntity(doc));
  }

  async countProducts(query: SearchQuery, category: Category | undefined): Promise<number> {
    const filter: any = { $text: { $search: query.toMongoTextSearch() } };
    if (category) {
      filter.category = category.getValue();
    }
    return this.productModel.countDocuments(filter).exec();
  }

  async getProductById(id: string): Promise<ProductEntity | null> {
    const doc = await this.productModel.findById(id).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  async getProductsByCategory(category: Category, limit: number, offset: number): Promise<ProductEntity[]> {
    const docs = await this.productModel
      .find({ category: category.getValue() })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    return docs.map(doc => this.mapToEntity(doc));
  }

  async countByCategory(category: Category): Promise<number> {
    return this.productModel.countDocuments({ category: category.getValue() }).exec();
  }

  
  private mapToEntity(doc: ProductDocument): ProductEntity {
    return new ProductEntity(
      doc._id.toString(),
      doc.name,
      doc.price,
      doc.category,
      doc.description || '',
      doc.stock,
      doc.imageUrl || '',
      doc.createdAt,
      doc.updatedAt,
    );
  }
}