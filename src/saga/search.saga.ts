import { Injectable } from '@nestjs/common';
import { SearchUseCase } from '../application/use-cases/search.use-case';
import { SearchResponse } from './search.model';

@Injectable()
export class SearchSaga {
  constructor(private readonly searchUseCase: SearchUseCase) {}

  async run(query?: string): Promise<SearchResponse> {
    const results = await this.searchUseCase.execute({ q: query });
    return {
      query: query ?? '',
      total: results.length,
      results,
    };
  }
}
