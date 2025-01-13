import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import {
  ShopCollection,
  ShopCollectionSchema,
} from './entities/collection.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ShopCollection.name,
        schema: ShopCollectionSchema,
      },
    ]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class ShopCollectionsModule {}
