import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Article, ArticleSchema } from '~/articles/entities/article.entity';
import { Asset, AssetSchema } from '~/assets/entities/asset.entity';
import {
  Collection,
  CollectionSchema,
} from '~/collections/entities/collection.entity';
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
        name: Collection.name,
        schema: CollectionSchema,
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
