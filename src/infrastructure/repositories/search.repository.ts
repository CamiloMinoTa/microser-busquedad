import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchRepository } from '../../domain/ports/search.repository';
import { Query } from '../../domain/value-objects/query.vo';
import { SearchResult } from '../../domain/entities/search-result.entity';
import { SearchResultDocument } from '../schemas/search-result.schema';

@Injectable()
export class SearchRepositoryImpl implements SearchRepository {
  constructor(
    @InjectModel(SearchResultDocument.name)
    private readonly searchModel: Model<SearchResultDocument>,
  ) {}

  async search(query: Query): Promise<SearchResult[]> {
    const term = query.value.trim();
    const filter = term
      ? {
          $or: [
            { title: { $regex: term, $options: 'i' } },
            { snippet: { $regex: term, $options: 'i' } },
            { source: { $regex: term, $options: 'i' } },
          ],
        }
      : {};

    const results = await this.searchModel.find(filter).lean().exec();
    return results.map(
      (item) => new SearchResult(item.title, item.snippet, item.source),
    );
  }
}
