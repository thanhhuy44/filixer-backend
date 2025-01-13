import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ArticleCollection,
  ArticleCollectionSchema,
} from '~/article-collections/entities/collection.entity';
import { Article, ArticleSchema } from '~/articles/entities/article.entity';
import { Asset, AssetSchema } from '~/assets/entities/asset.entity';
import { User, UserSchema } from '~/users/entities/user.entity';

import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Article.name,
        schema: ArticleSchema,
      },
      {
        name: Asset.name,
        schema: AssetSchema,
      },
      {
        name: ArticleCollection.name,
        schema: ArticleCollectionSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
