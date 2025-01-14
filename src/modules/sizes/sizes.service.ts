import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';

import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Size } from './entities/size.entity';

@Injectable()
export class SizesService {
  constructor(
    @InjectModel(Size.name) private readonly SizeModel: Model<Size>,
  ) {}

  async create(body: CreateSizeDto) {
    if (!body.name) {
      throw new BadRequestException('Bad Request!');
    }

    const existSize = await this.SizeModel.findOne({ name: body.name });
    if (existSize) {
      throw new ConflictException('Size name is exist!');
    }

    const newSize = await this.SizeModel.create(body);

    return newSize;
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const sizes = await this.SizeModel.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.SizeModel.countDocuments();
    return {
      data: sizes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Bad Request!');
    }

    const size = await this.SizeModel.findById(id);
    if (!size) {
      throw new NotFoundException('Not found!');
    }

    return size;
  }

  async update(id: string, body: UpdateSizeDto) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Bad Request!');
    }

    const updatedSize = await this.SizeModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedSize) {
      throw new NotFoundException('Not found!');
    }

    return updatedSize;
  }

  async remove(id: string) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Bad Request!');
    }

    const deletedSize = await this.SizeModel.findByIdAndDelete(id);
    if (!deletedSize) {
      throw new NotFoundException('Size not found!');
    }

    return deletedSize._id;
  }
}
