import { SearchResult } from '../domain/entities/search-result.entity';

export interface SearchResponse {
  query: string;
  total: number;
  results: SearchResult[];
}
