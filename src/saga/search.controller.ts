import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResult } from './search.model';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') query = ''): Promise<SearchResult[]> {
    return this.searchService.search(query);
  }
}
