// src/domain/value-objects/search-query.value-object.ts

export class SearchQuery {
  private readonly value: string;
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length < SearchQuery.MIN_LENGTH) {
      throw new Error(`Search query must be at least ${SearchQuery.MIN_LENGTH} characters`);
    }

    if (trimmedValue.length > SearchQuery.MAX_LENGTH) {
      throw new Error(`Search query must not exceed ${SearchQuery.MAX_LENGTH} characters`);
    }

    // Sanitizar input para prevenir inyección
    this.value = this.sanitize(trimmedValue);
  }

  private sanitize(value: string): string {
    // Eliminar caracteres especiales peligrosos
    return value.replace(/[<>\"\'&;]/g, '').trim();
  }

  getValue(): string {
    return this.value;
  }

  toMongoTextSearch(): string {
    // Preparar query para búsqueda de texto en MongoDB
    return this.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  getTerms(): string[] {
    // Dividir en términos de búsqueda
    return this.value.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  }

  equals(other: SearchQuery): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}