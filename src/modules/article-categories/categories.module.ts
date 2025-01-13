import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Article, ArticleSchema } from '~/articles/entities/article.entity';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import {
  ArticleCategory,
  ArticleCategorySchema,
} from './entities/category.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ArticleCategory.name,
        schema: ArticleCategorySchema,
      },
      {
        name: Article.name,
        schema: ArticleSchema,
      },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
