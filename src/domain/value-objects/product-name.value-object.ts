// src/domain/value-objects/product-name.value-object.ts

export class ProductName {
  private readonly value: string;
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 200;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Product name is required');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length < ProductName.MIN_LENGTH) {
      throw new Error(`Product name must be at least ${ProductName.MIN_LENGTH} characters`);
    }

    if (trimmedValue.length > ProductName.MAX_LENGTH) {
      throw new Error(`Product name must not exceed ${ProductName.MAX_LENGTH} characters`);
    }

    this.value = trimmedValue;
  }

  getValue(): string {
    return this.value;
  }

  toSearchFormat(): string {
    return this.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  equals(other: ProductName): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}