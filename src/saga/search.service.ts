import { Injectable } from '@nestjs/common';
import { SearchSaga } from './search.saga';
import { SearchResult } from './search.model';

@Injectable()
export class SearchService {
  constructor(private readonly saga: SearchSaga) {}

  async search(query: string): Promise<SearchResult> {
    return this.saga.executeSearch(query);
  }
}