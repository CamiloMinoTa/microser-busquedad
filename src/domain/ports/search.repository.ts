import { Query } from '../value-objects/query.vo';
import { SearchResult } from '../entities/search-result.entity';

export abstract class SearchRepository {
  abstract search(query: Query): Promise<SearchResult[]>;
}
