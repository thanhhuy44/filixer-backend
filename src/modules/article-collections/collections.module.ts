import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Article, ArticleSchema } from '~/articles/entities/article.entity';
import { Asset, AssetSchema } from '~/assets/entities/asset.entity';

import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import {
  ArticleCollection,
  ArticleCollectionSchema,
} from './entities/collection.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ArticleCollection.name,
        schema: ArticleCollectionSchema,
      },
      {
        name: Article.name,
        schema: ArticleSchema,
      },
      {
        name: Asset.name,
        schema: AssetSchema,
      },
    ]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
