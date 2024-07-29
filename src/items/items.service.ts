import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './interfaces/item.interface';
import { CreateItemDto, ItemType } from './dto/create-item.dto';
import { Cache } from 'cache-manager';
import { redisContants } from 'src/constants';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel('Item') private readonly itemModel: Model<Item>,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  async findOne(id: string): Promise<Item> {
    const cachedItem = await this.cacheManager.get<Item>(id);

    if (cachedItem) {
      return cachedItem;
    }

    const item = await this.itemModel.findById(id);
    if (!item) {
      throw new NotFoundException('There is not any item with that id.');
    }

    await this.cacheManager.set(id, item, 60000);
    return item;
  }

  async findAll(): Promise<Item[]> {
    const cachedItems = await this.cacheManager.get<Item[]>(
      redisContants.cache_key,
    );

    if (cachedItems) {
      return cachedItems;
    }
    const items = await this.itemModel.find().exec();
    await this.cacheManager.set(redisContants.cache_key, items, 600000);
    return items;
  }

  async createItem(createItemDto: CreateItemDto): Promise<Item> {
    const createdItem = new this.itemModel(createItemDto);
    await this.cacheManager.del(redisContants.cache_key);
    return await createdItem.save();
  }

  async delete(id: string): Promise<Item> {
    await this.cacheManager.del(redisContants.cache_key);
    await this.cacheManager.del(id);
    return await this.itemModel.findByIdAndDelete(id);
  }

  async update(id: string, createItemDto: CreateItemDto): Promise<Item> {
    await this.cacheManager.del(redisContants.cache_key);
    return await this.itemModel.findByIdAndUpdate(id, createItemDto, {
      new: true,
    });
  }
}
