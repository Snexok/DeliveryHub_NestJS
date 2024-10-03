import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Field, Int, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Product {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field()
  @Column({ unique: true })
  sku: string;

  @Field(() => Int)
  @Column('int')
  stock: number;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;
}
