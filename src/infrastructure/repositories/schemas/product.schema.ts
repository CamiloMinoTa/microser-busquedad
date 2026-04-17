import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true, // Mongoose gestiona esto automáticamente
  collection: 'products',
})
export class ProductDocument extends Document {
  @Prop({
    required: true,
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [200, 'El nombre no puede exceder 200 caracteres'],
  })
  name!: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
  })
  description?: string;

  @Prop({
    required: true,
    min: [0, 'El precio no puede ser negativo'],
  })
  price!: number;

  @Prop({
    required: true,
    min: [0, 'El stock no puede ser negativo'],
    default: 0,
  })
  stock!: number;

  @Prop({
    required: true,
    enum: ['Libros', 'Tecnología', 'Ropa', 'Merchandising', 'Textos Académicos', 'Papelería', 'Otros'],
  })
  category!: string;

  @Prop({
    required: false,
    validate: {
      validator: (v: string) => !v || /^https?:\/\/.+/.test(v),
      message: 'URL de imagen inválida',
    },
  })
  imageUrl?: string;

  // ✅ AGREGA ESTO: Declaración explícita para que TypeScript no de error en el Repository
   @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}


export const ProductSchema = SchemaFactory.createForClass(ProductDocument);

// Índices optimizados para MongoDB Atlas
ProductSchema.index(
  { name: 'text', description: 'text', category: 'text' },
  { weights: { name: 10, description: 5, category: 3 }, name: 'product_search_index' }
);
ProductSchema.index({ category: 1 });
ProductSchema.index({ stock: 1 });