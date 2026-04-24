import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'search_results' })
export class SearchResultDocument extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  snippet: string;

  @Prop({ required: true })
  source: string;
}

export const SearchResultSchema = SchemaFactory.createForClass(SearchResultDocument);
