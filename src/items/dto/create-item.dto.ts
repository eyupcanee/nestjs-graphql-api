import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { IsString, IsInt, IsOptional, Min, IsIn } from 'class-validator';

@ObjectType()
export class ItemType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field((type) => Int)
  quantity: number;
}

@InputType()
export class CreateItemDto {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field((type) => Int)
  @IsInt()
  @Min(0)
  quantity: number;
}
