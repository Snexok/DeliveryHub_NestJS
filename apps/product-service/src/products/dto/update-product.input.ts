import { InputType, Field, Float, Int, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';
import { IsOptional, IsString, IsNumber } from 'class-validator';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  price?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sku?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
