import { Module } from '@nestjs/common';
import { SearchSaga } from './search.saga';
import { SearchService } from './search.service';

@Module({
  providers: [SearchSaga, SearchService],
  exports: [SearchService],
})
export class SearchModule {}