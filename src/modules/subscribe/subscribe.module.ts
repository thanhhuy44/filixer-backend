import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Subscribe, SubscribeSchema } from './entities/subscribe.entity';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscribe.name,
        schema: SubscribeSchema,
      },
    ]),
  ],
  controllers: [SubscribeController],
  providers: [SubscribeService],
})
export class SubscribeModule {}
