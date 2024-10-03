import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { CategoriesService } from '../categories/categories.service';
import { GraphQLResolveInfo } from 'graphql/type';
import { fieldsList } from 'graphql-fields-list';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const PRODUCT_RELATIONS = ['category'];

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoriesService: CategoriesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const category = await this.categoriesService.findOne(
      createProductInput.categoryId,
    );
    let product = new Product();
    product = Object.assign(product, {
      ...createProductInput,
      category,
    });

    const productSaved = this.productsRepository.save(product);

    await this.cacheManager.del('products');

    return productSaved;
  }

  async findAll(info?: GraphQLResolveInfo): Promise<Product[]> {
    let relations = [];
    if (info) {
      const reqFields = fieldsList(info);
      relations = reqFields.filter((field) =>
        PRODUCT_RELATIONS.includes(field),
      );
    }

    const cached: Product[] =
      await this.cacheManager.get<Product[]>('products');
    if (cached) {
      return cached;
    }

    const products = await this.productsRepository.find({
      relations,
    });

    await this.cacheManager.set('products', products, { ttl: 60 });

    return products;
  }

  async findOne(id: number, info?: GraphQLResolveInfo): Promise<Product> {
    let relations = [];
    if (info) {
      const reqFields = fieldsList(info);
      relations = reqFields.filter((field) =>
        PRODUCT_RELATIONS.includes(field),
      );
    }

    const product = await this.productsRepository.findOne({
      where: { id },
      relations,
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductInput.categoryId) {
      const category = await this.categoriesService.findOne(
        updateProductInput.categoryId,
      );
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateProductInput.categoryId} not found`,
        );
      }
      product.category = category;
    }

    Object.assign(product, updateProductInput);
    const updatedProduct = await this.productsRepository.save(product);

    await this.cacheManager.del('products');

    return updatedProduct;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.cacheManager.del('products');

    return true;
  }
}
