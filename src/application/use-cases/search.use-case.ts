import { Injectable } from '@nestjs/common';
import { SearchRepository } from '../../domain/ports/search.repository';
import { SearchResult } from '../../domain/entities/search-result.entity';
import { Query } from '../../domain/value-objects/query.vo';
import { SearchQueryDto } from '../dtos/search-query.dto';

@Injectable()
export class SearchUseCase {
  constructor(private readonly repository: SearchRepository) {}

  async execute(queryDto: SearchQueryDto): Promise<SearchResult[]> {
    const query = new Query(queryDto.q ?? '');
    return this.repository.search(query);
  }
}
