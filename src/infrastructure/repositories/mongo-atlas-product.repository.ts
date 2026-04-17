import {
  Injectable,
  Logger,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Connection,
  Model,
  Types,
  createConnection,
  isValidObjectId,
} from 'mongoose';
import { Product } from '../../domain/entities/product.entity';
import type { ProductRepository } from '../../domain/ports/product.repository';
import type { SearchQuery } from '../../domain/value-objects/search-query.value-object';
import {
  type MongoProductDocument,
  productSchema,
} from './schemas/product.schema';

type MongoProductFilter = Record<string, unknown>;

@Injectable()
export class MongoAtlasProductRepository
  implements ProductRepository, OnModuleDestroy
{
  private readonly logger = new Logger(MongoAtlasProductRepository.name);
  private readonly modelName = 'SearchProduct';
  private connection?: Connection;
  private modelPromise?: Promise<Model<MongoProductDocument>>;

  constructor(private readonly configService: ConfigService) {}

  async findAll(): Promise<ReadonlyArray<Product>> {
    const productModel = await this.getModel();
    const documents = await productModel
      .find()
      .sort({ title: 1 })
      .lean()
      .exec();

    return documents.map((document) => this.toDomain(document));
  }

  async findById(productId: string): Promise<Product | null> {
    const productModel = await this.getModel();
    const filter: MongoProductFilter = isValidObjectId(productId)
      ? {
          $or: [
            { _id: productId as never },
            { _id: new Types.ObjectId(productId) as never },
          ],
        }
      : { _id: productId as never };
    const document = await productModel.findOne(filter).lean().exec();

    return document ? this.toDomain(document) : null;
  }

  async search(query: SearchQuery): Promise<ReadonlyArray<Product>> {
    const productModel = await this.getModel();
    const filter = this.buildSearchFilter(query);
    const documents = await productModel
      .find(filter)
      .sort({ title: 1 })
      .lean()
      .exec();
    return documents.map((document) => this.toDomain(document));
  }

  async autocomplete(
    query: SearchQuery,
    limit = 5,
  ): Promise<ReadonlyArray<string>> {
    const productModel = await this.getModel();
    const prefixRegex = this.buildPrefixRegex(query.normalized);
    const documents = await productModel
      .find({
        $or: [{ title: prefixRegex }, { tags: prefixRegex }],
      })
      .sort({ title: 1 })
      .limit(limit)
      .lean()
      .exec();

    const suggestions = new Set<string>();

    for (const document of documents) {
      const title = document.title?.trim();
      if (title) {
        suggestions.add(title);
      }

      if (suggestions.size >= limit) {
        break;
      }
    }

    return Array.from(suggestions).slice(0, limit);
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.connection) {
      return;
    }

    await this.connection.close();
    this.connection = undefined;
    this.modelPromise = undefined;
  }

  private async getModel(): Promise<Model<MongoProductDocument>> {
    if (!this.modelPromise) {
      this.modelPromise = this.initializeModel().catch((error: unknown) => {
        this.modelPromise = undefined;
        throw error;
      });
    }

    return this.modelPromise;
  }

  private async initializeModel(): Promise<Model<MongoProductDocument>> {
    const mongodbUri = this.configService.get<string>('MONGODB_URI');
    const dbName =
      this.configService.get<string>('MONGODB_DB_NAME') || undefined;
    const collectionName =
      this.configService.get<string>('MONGODB_COLLECTION') || 'search_results';

    if (!mongodbUri) {
      throw new ServiceUnavailableException(
        'Mongo Atlas no esta configurado. Define MONGODB_URI.',
      );
    }

    try {
      this.connection = await createConnection(mongodbUri, {
        dbName,
        serverSelectionTimeoutMS: 5000,
      }).asPromise();

      this.logger.log(
        `Mongo Atlas conectado a la coleccion "${collectionName}"`,
      );

      return (
        this.connection.models[this.modelName] ||
        this.connection.model<MongoProductDocument>(
          this.modelName,
          productSchema,
          collectionName,
        )
      );
    } catch (error) {
      this.logger.error('No fue posible conectar con Mongo Atlas.', error);
      throw new ServiceUnavailableException(
        'No fue posible conectar con Mongo Atlas.',
      );
    }
  }

  private toDomain(document: MongoProductDocument): Product {
    return Product.create({
      id: document._id.toString(),
      title: document.title ?? '',
      description: document.description ?? '',
      category: document.category ?? '',
      tags: Array.isArray(document.tags) ? document.tags : [],
    });
  }

  private buildSearchFilter(query: SearchQuery): MongoProductFilter {
    const terms = query.normalized
      .split(' ')
      .map((term) => term.trim())
      .filter(Boolean);

    if (terms.length === 0) {
      return {};
    }

    return {
      $and: terms.map((term) => ({
        $or: [
          { title: this.buildRegex(term) },
          { description: this.buildRegex(term) },
          { category: this.buildRegex(term) },
          { tags: this.buildRegex(term) },
        ],
      })),
    };
  }

  private buildRegex(term: string): RegExp {
    return new RegExp(this.escapeRegExp(term), 'i');
  }

  private buildPrefixRegex(term: string): RegExp {
    return new RegExp(`^${this.escapeRegExp(term)}`, 'i');
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
