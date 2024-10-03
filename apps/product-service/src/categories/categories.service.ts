import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { GraphQLResolveInfo } from 'graphql/type';
import { fieldsList } from 'graphql-fields-list';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../products/entities/product.entity';

const CATEGORY_RELATIONS = ['products'];

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryInput.name },
    });
    if (existingCategory) {
      throw new ConflictException(
        `Категория с именем "${createCategoryInput.name}" уже существует.`,
      );
    }

    const category = this.categoriesRepository.create(createCategoryInput);
    return this.categoriesRepository.save(category);
  }

  async findAll(info?: GraphQLResolveInfo): Promise<Category[]> {
    let relations = [];
    if (info) {
      const reqFields = fieldsList(info);
      relations = reqFields.filter((field) =>
        CATEGORY_RELATIONS.includes(field),
      );
    }

    const cached: Category[] =
      await this.cacheManager.get<Category[]>('categories');
    if (cached) {
      return cached;
    }

    return this.categoriesRepository.find({
      relations,
    });
  }

  async findOne(id: number, info?: GraphQLResolveInfo): Promise<Category> {
    let relations = [];
    if (info) {
      const reqFields = fieldsList(info);
      relations = reqFields.filter((field) =>
        CATEGORY_RELATIONS.includes(field),
      );
    }

    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }
}
