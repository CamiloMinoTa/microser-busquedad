import { Injectable } from '@nestjs/common';
import { SearchResult } from './search.model';

@Injectable()
export class SearchSaga {
  async executeSearch(query: string): Promise<SearchResult> {
    console.log(`Saga: Processing search for "${query}"`);
    return new SearchResult(query, 0);
  }
}