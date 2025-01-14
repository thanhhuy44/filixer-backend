import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';

import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';

@Injectable()
export class ColorsService {
  constructor(
    @InjectModel(Color.name) private readonly ColorModel: Model<Color>,
  ) {}

  async create(body: CreateColorDto) {
    const { name, code } = body;
    if (!name || !code) {
      throw new BadRequestException('Bad Request!');
    }
    const existColor = await this.ColorModel.findOne({ code });
    if (existColor) {
      throw new ConflictException('Color is exist!');
    }

    const newColor = await this.ColorModel.create(body);
    return newColor;
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const data = await this.ColorModel.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.ColorModel.countDocuments();
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Bad Request');
    }

    const color = await this.ColorModel.findById(id);
    if (!color) {
      throw new NotFoundException('Not found!');
    }

    return color;
  }

  async update(id: string, body: UpdateColorDto) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Bad Request');
    }

    if (body.code) {
      const colorWithDiffId = await this.ColorModel.findOne({
        code: body.code,
      });
      if (colorWithDiffId && colorWithDiffId._id.toString() !== id) {
        throw new ConflictException('Color update is exist!');
      }
    }

    const updatedColor = await this.ColorModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedColor) {
      throw new NotFoundException('Not found!');
    }

    return updatedColor;
  }

  async remove(id: string) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Bad Request');
    }

    const deletedColor = await this.ColorModel.findByIdAndDelete(id);
    if (!deletedColor) {
      throw new NotFoundException('Not found!');
    }

    return deletedColor._id;
  }
}
