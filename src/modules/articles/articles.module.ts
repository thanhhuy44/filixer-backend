import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ArticleCategory,
  ArticleCategorySchema,
} from '~/article-categories/entities/category.entity';
import {
  ArticleComment,
  ArticleCommentSchema,
} from '~/article-comments/entities/comment.entity';
import { Asset, AssetSchema } from '~/assets/entities/asset.entity';
import { User, UserSchema } from '~/users/entities/user.entity';

import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article, ArticleSchema } from './entities/article.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Article.name,
        schema: ArticleSchema,
      },
      {
        name: ArticleComment.name,
        schema: ArticleCommentSchema,
      },
      {
        name: ArticleCategory.name,
        schema: ArticleCategorySchema,
      },
      {
        name: Asset.name,
        schema: AssetSchema,
      },
    ]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
