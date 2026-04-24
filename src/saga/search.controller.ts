import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResponse } from './search.model';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') q?: string): Promise<SearchResponse> {
    return this.searchService.search(q);
  }
}
