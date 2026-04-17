// src/domain/value-objects/product-id.value-object.ts

export class ProductId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Product ID is required');
    }

    // Validar formato de ObjectId de MongoDB (24 caracteres hexadecimales)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(value)) {
      throw new Error('Invalid Product ID format');
    }

    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProductId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}