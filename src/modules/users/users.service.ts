import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { ESortDirection } from '@/types/enum';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  async findAll(pagination: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = ESortDirection.DESC,
    } = pagination;
    const users = await this.UserModel.find({})
      .sort([[sortBy, sortDirection]])
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.UserModel.countDocuments();
    return {
      data: users,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = (await this.UserModel.findById(id)).populate('avatar');
    return user;
  }
  async update(id: string, body: UpdateUserDto) {
    const updatedUser = await this.UserModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        ...body,
        updatedAt: Date.now(),
      },
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('Not found user!');
    }
    return updatedUser;
  }
}
