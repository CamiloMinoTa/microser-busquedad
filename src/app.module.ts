import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Infrastructure
import { MongoSearchRepository } from './infrastructure/repositories/mongo-search.repositoy'
import { ProductDocument, ProductSchema } from './infrastructure/repositories/schemas/product.schema';

// Controllers & Services básicos
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/univalleshop'),
    MongooseModule.forFeature([{ name: ProductDocument.name, schema: ProductSchema }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'SearchRepositoryPort',
      useClass: MongoSearchRepository,
    },
  ],
})
export class AppModule {}