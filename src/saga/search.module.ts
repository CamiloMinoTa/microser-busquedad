import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchSaga } from './search.saga';
import { SearchUseCase } from '../application/use-cases/search.use-case';
import { SearchRepository } from '../domain/ports/search.repository';
import { SearchRepositoryImpl } from '../infrastructure/repositories/search.repository';
import { SearchResultDocument, SearchResultSchema } from '../infrastructure/schemas/search-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SearchResultDocument.name, schema: SearchResultSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    SearchSaga,
    SearchUseCase,
    {
      provide: SearchRepository,
      useClass: SearchRepositoryImpl,
    },
  ],
  exports: [SearchService],
})
export class SearchModule {}
