// src/domain/value-objects/category.value-object.ts

export enum CategoryType {
  LIBROS = 'Libros',
  TECNOLOGIA = 'Tecnología',
  ROPA = 'Ropa',
  MERCHANDISING = 'Merchandising',
  TEXTOS_ACADEMICOS = 'Textos Académicos',
  PAPELERIA = 'Papelería',
  OTROS = 'Otros'
}

export class Category {
  private readonly value: CategoryType;

  constructor(value: CategoryType | string) {
    const categoryValue = typeof value === 'string' ? value.toUpperCase().replace(/\s+/g, '_') : value;
    
    if (!this.isValidCategory(categoryValue)) {
      throw new Error(`Invalid category: ${value}. Valid categories are: ${Object.values(CategoryType).join(', ')}`);
    }

    this.value = categoryValue as CategoryType;
  }

  private isValidCategory(value: string): boolean {
    return Object.values(CategoryType).some(cat => 
      cat.toUpperCase().replace(/\s+/g, '_') === value
    );
  }

  getValue(): CategoryType {
    return this.value;
  }

  equals(other: Category): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }

  static getValidCategories(): CategoryType[] {
    return Object.values(CategoryType);
  }
}