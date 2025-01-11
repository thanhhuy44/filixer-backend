import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Article, ArticleSchema } from '~/articles/entities/article.entity';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './entities/category.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
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
