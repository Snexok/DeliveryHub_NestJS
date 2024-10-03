import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  sku: string;

  @Field(() => Int)
  @IsNumber()
  stock: number;

  @Field(() => Int)
  @IsNumber()
  categoryId: number;
}
