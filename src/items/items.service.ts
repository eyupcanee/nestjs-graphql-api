import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './interfaces/item.interface';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  constructor(@InjectModel('Item') private readonly itemModel: Model<Item>) {}

  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id);
    if (!item) {
      throw new NotFoundException('There is not any item with that id.');
    }
    return item;
  }

  async findAll(): Promise<Item[]> {
    return await this.itemModel.find().exec();
  }

  async createItem(createItemDto: CreateItemDto): Promise<Item> {
    const createdItem = new this.itemModel(createItemDto);
    return await createdItem.save();
  }

  async delete(id: string): Promise<Item> {
    return await this.itemModel.findByIdAndDelete(id);
  }

  async update(id: string, createItemDto: CreateItemDto): Promise<Item> {
    return await this.itemModel.findByIdAndUpdate(id, createItemDto, {
      new: true,
    });
  }
}
