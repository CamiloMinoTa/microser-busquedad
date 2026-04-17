export class SearchQuery {
  readonly value: string;
  readonly normalized: string;

  constructor(rawQuery?: string) {
    this.value = rawQuery?.trim().replace(/\s+/g, ' ') ?? '';
    this.normalized = this.value.toLowerCase();
  }

  get isEmpty(): boolean {
    return this.normalized.length === 0;
  }
}
