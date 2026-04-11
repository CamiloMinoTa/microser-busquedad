import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchSaga } from './search.saga';

@Module({
  imports: [],
  controllers: [SearchController],
  providers: [SearchService, SearchSaga],
  exports: [SearchService],
})
export class SearchModule {}
