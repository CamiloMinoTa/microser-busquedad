export class SearchResult {
  id: string;
  query: string;
  resultsCount: number;
  timestamp: Date;

  constructor(query: string, count: number) {
    this.id = Math.random().toString(36).substring(7);
    this.query = query;
    this.resultsCount = count;
    this.timestamp = new Date();
  }
}