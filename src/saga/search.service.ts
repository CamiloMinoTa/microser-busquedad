import { Injectable } from '@nestjs/common';
import { SearchSaga } from './search.saga';
import { SearchResponse } from './search.model';

@Injectable()
export class SearchService {
  constructor(private readonly searchSaga: SearchSaga) {}

  async search(query?: string): Promise<SearchResponse> {
    return this.searchSaga.run(query);
  }
}
