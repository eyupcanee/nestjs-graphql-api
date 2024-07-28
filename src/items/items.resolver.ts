import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { ItemType } from './dto/create-item.dto';
import { Item } from './interfaces/item.interface';
import { CreateItemDto } from './dto/create-item.dto';

@Resolver((of) => ItemType)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query((returns) => ItemType)
  async item(@Args('id') id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Query((returns) => [ItemType])
  async items(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Mutation((returns) => ItemType)
  async createItem(
    @Args('createItemInput') createItemDto: CreateItemDto,
  ): Promise<Item> {
    return this.itemsService.createItem(createItemDto);
  }

  @Mutation((returns) => ItemType)
  async deleteItem(@Args('id') id: string): Promise<Item> {
    return this.itemsService.delete(id);
  }

  @Mutation((returns) => ItemType)
  async updateItem(
    @Args('id') id: string,
    @Args('createItemInput') createItemInput: CreateItemDto,
  ) {
    return this.itemsService.update(id, createItemInput);
  }
}
