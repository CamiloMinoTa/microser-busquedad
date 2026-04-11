export interface SearchResult {
  id: number;
  title: string;
  description: string;
}

export class SearchCommand {
  constructor(public readonly query: string) {}
}

export class SearchCompletedEvent {
  constructor(public readonly results: SearchResult[]) {}
}
