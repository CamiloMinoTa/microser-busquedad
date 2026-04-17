// src/domain/entities/product.entity.ts

export class ProductEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    price: number,
    category: string,
    description: string = '',
    stock: number = 0,
    imageUrl: string = '',
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isAvailable(): boolean {
    return this.stock > 0;
  }

  hasStock(quantity: number): boolean {
    return this.stock >= quantity;
  }
}