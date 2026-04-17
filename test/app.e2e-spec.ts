import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from './../src/domain/ports/product.repository';
import { Product } from './../src/domain/entities/product.entity';
import { SearchQuery } from './../src/domain/value-objects/search-query.value-object';

const productsFixture: Product[] = [
  Product.create({
    id: 'prd-001',
    title: 'Laptop ThinkPro 14',
    description: 'Laptop ligera para desarrollo, oficina y trabajo remoto.',
    category: 'computers',
    tags: ['laptop', 'developer', 'office'],
  }),
  Product.create({
    id: 'prd-002',
    title: 'Monitor UltraView 27',
    description: 'Monitor QHD pensado para productividad y multitarea.',
    category: 'monitors',
    tags: ['monitor', 'qhd', 'office'],
  }),
];

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let productRepositoryMock: ProductRepository;

  beforeEach(async () => {
    productRepositoryMock = {
      findAll: jest.fn().mockResolvedValue(productsFixture),
      findById: jest
        .fn()
        .mockImplementation((productId: string) =>
          Promise.resolve(
            productsFixture.find((product) => product.id === productId) ?? null,
          ),
        ),
      search: jest.fn().mockImplementation((query: SearchQuery) => {
        const normalizedQuery = query.normalized;

        return Promise.resolve(
          productsFixture.filter(
            (product) =>
              product.title.toLowerCase().includes(normalizedQuery) ||
              product.description.toLowerCase().includes(normalizedQuery) ||
              product.category.toLowerCase().includes(normalizedQuery) ||
              product.tags.some((tag) =>
                tag.toLowerCase().includes(normalizedQuery),
              ),
          ),
        );
      }),
      autocomplete: jest.fn().mockImplementation((query: SearchQuery) => {
        const normalizedQuery = query.normalized;

        return Promise.resolve(
          productsFixture
            .map((product) => product.title)
            .filter((title) => title.toLowerCase().includes(normalizedQuery)),
        );
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PRODUCT_REPOSITORY)
      .useValue(productRepositoryMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/search (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/search')
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'prd-001',
        }),
      ]),
    );
  });

  it('/search?q=monitor (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/search?q=monitor')
      .expect(200);

    expect(response.body).toEqual([
      expect.objectContaining({
        id: 'prd-002',
        title: 'Monitor UltraView 27',
      }),
    ]);
  });

  it('/search/autocomplete?q=lap (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/search/autocomplete?q=lap')
      .expect(200);

    expect(response.body).toEqual(['Laptop ThinkPro 14']);
  });

  it('/products (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'prd-001',
        }),
      ]),
    );
  });

  it('/products/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/products/prd-002')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 'prd-002',
        title: 'Monitor UltraView 27',
      }),
    );
  });
});
