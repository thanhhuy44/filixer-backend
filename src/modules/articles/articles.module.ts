import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Asset, AssetSchema } from '~/assets/entities/asset.entity';
import {
  Category,
  CategorySchema,
} from '~/categories/entities/category.entity';
import { Comment, CommentSchema } from '~/comments/entities/comment.entity';
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
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
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
