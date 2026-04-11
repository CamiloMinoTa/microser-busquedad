import { Injectable, Logger } from '@nestjs/common';
import { SearchCommand, SearchCompletedEvent, SearchResult } from './search.model';

@Injectable()
export class SearchSaga {
  private readonly logger = new Logger(SearchSaga.name);

  async execute(query: string): Promise<SearchResult[]> {
    this.logger.log(`Saga started for query="${query}"`);

    const searchCommand = new SearchCommand(query);
    const searchResult = await this.runSearchCommand(searchCommand);
    const event = new SearchCompletedEvent(searchResult);

    this.logger.log(`Saga completed with ${event.results.length} result(s)`);
    return event.results;
  }

  private async runSearchCommand(command: SearchCommand): Promise<SearchResult[]> {
    const mockIndex: SearchResult[] = [
      {
        id: 1,
        title: 'NestJS Search',
        description: 'Implementación de saga para búsquedas',
      },
      {
        id: 2,
        title: 'Microservicio de Búsqueda',
        description: 'Servicio Docker Compose con NestJS',
      },
      {
        id: 3,
        title: 'Búsqueda Rápida',
        description: 'Resultado simulado para pruebas locales',
      },
    ];

    const normalizedQuery = command.query.trim().toLowerCase();
    if (!normalizedQuery) {
      return mockIndex;
    }

    return mockIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery),
    );
  }
}
