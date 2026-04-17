import { Schema, Types } from 'mongoose';

export interface MongoProductDocument {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: string;
  tags: string[];
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
}

export const productSchema = new Schema<MongoProductDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      set: normalizeStringArray,
      index: true,
    },
  },
  {
    versionKey: false,
    strict: true,
  },
);

productSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  tags: 'text',
});
