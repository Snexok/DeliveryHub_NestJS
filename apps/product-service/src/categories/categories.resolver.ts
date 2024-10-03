import { Resolver, Query, Args, Int, Mutation, Info } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { GraphQLResolveInfo } from 'graphql/type';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category)
  @UsePipes(new ValidationPipe({ transform: true }))
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll(@Info() info: GraphQLResolveInfo) {
    return this.categoriesService.findAll(info);
  }

  @Query(() => Category, { name: 'category' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    return this.categoriesService.findOne(id, info);
  }
}
