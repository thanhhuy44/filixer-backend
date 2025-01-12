import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SubscribeStatus } from '@/types/enum';

import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { UpdateSubscribeDto } from './dto/update-subscribe.dto';
import { Subscribe } from './entities/subscribe.entity';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectModel(Subscribe.name)
    private readonly SubscribeModal: Model<Subscribe>,
  ) {}

  async create(body: CreateSubscribeDto) {
    const { email } = body;
    const existEmail = await this.SubscribeModal.findOne({
      email,
    });
    if (existEmail && existEmail.status === SubscribeStatus.ACTIVE) {
      throw new ConflictException('Exist!');
    }
    if (existEmail && existEmail.status === SubscribeStatus.CANCELED) {
      const updated = await this.SubscribeModal.findByIdAndUpdate(
        existEmail._id,
        { status: SubscribeStatus.ACTIVE, updatedAt: Date.now() },
        { new: true },
      );
      if (!updated) {
        throw new NotFoundException('Not found!');
      }
      return updated;
    }
    const newSubscribe = await this.SubscribeModal.create({
      email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return newSubscribe;
  }

  findAll() {
    return `This action returns all subscribe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscribe`;
  }

  update(id: number, updateSubscribeDto: UpdateSubscribeDto) {
    console.log(
      '🚀 ~ SubscribeService ~ update ~ updateSubscribeDto:',
      updateSubscribeDto,
    );
    return `This action updates a #${id} subscribe`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscribe`;
  }
}
