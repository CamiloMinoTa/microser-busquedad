import { Injectable } from '@nestjs/common';
import { SearchSaga } from './search.saga';
import { SearchResult } from './search.model';

@Injectable()
export class SearchService {
  constructor(private readonly searchSaga: SearchSaga) {}

  search(query: string): Promise<SearchResult[]> {
    return this.searchSaga.execute(query);
  }
}
