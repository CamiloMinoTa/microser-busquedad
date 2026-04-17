// src/domain/value-objects/price.value-object.ts

export class Price {
  private readonly value: number;
  private static readonly MIN_PRICE = 0;
  private static readonly MAX_PRICE = 999999999;

  constructor(value: number) {
    if (isNaN(value)) {
      throw new Error('Price must be a valid number');
    }

    if (value < Price.MIN_PRICE) {
      throw new Error('Price cannot be negative');
    }

    if (value > Price.MAX_PRICE) {
      throw new Error(`Price cannot exceed ${Price.MAX_PRICE}`);
    }

    // Redondear a 2 decimales
    this.value = Math.round(value * 100) / 100;
  }

  getValue(): number {
    return this.value;
  }

  toCOP(): number {
    // Precio en pesos colombianos (asumiendo que ya está en COP)
    return this.value;
  }

  add(other: Price): Price {
    return new Price(this.value + other.getValue());
  }

  subtract(other: Price): Price {
    const result = this.value - other.getValue();
    if (result < 0) {
      throw new Error('Result cannot be negative');
    }
    return new Price(result);
  }

  multiply(factor: number): Price {
    if (factor < 0) {
      throw new Error('Factor cannot be negative');
    }
    return new Price(this.value * factor);
  }

  equals(other: Price): boolean {
    return this.value === other.getValue();
  }

  greaterThan(other: Price): boolean {
    return this.value > other.getValue();
  }

  lessThan(other: Price): boolean {
    return this.value < other.getValue();
  }

  toString(): string {
    return `$${this.value.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
}