export interface ProductPrimitives {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export class Product {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly tags: string[];

  private constructor(props: ProductPrimitives) {
    this.id = props.id.trim();
    this.title = props.title.trim();
    this.description = props.description.trim();
    this.category = props.category.trim().toLowerCase();
    this.tags = props.tags
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  static create(props: ProductPrimitives): Product {
    return new Product({
      id: props.id,
      title: props.title,
      description: props.description,
      category: props.category,
      tags: props.tags,
    });
  }

  toPrimitives(): ProductPrimitives {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      tags: [...this.tags],
    };
  }
}
