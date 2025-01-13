import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EArticleStatus } from '@/types/enum';
import { ArticleCollection } from '~/article-collections/entities/collection.entity';
import { Article } from '~/articles/entities/article.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Article.name) private readonly ArticleModel: Model<Article>,
    @InjectModel(ArticleCollection.name)
    private readonly CollectionModel: Model<ArticleCollection>,
  ) {}

  async getHome() {
    const topHero = await this.CollectionModel.findOne({
      slug: 'top-hero',
    }).populate([
      'thumbnail',
      {
        path: 'articles',
        populate: ['thumbnail', 'categories', 'author'],
      },
    ]);
    const trending = await this.CollectionModel.findOne({
      slug: 'trending',
    }).populate([
      'thumbnail',
      {
        path: 'articles',
        populate: ['thumbnail', 'categories', 'author'],
      },
    ]);

    const recommend = await this.CollectionModel.findOne({
      slug: 'recommend',
    }).populate([
      'thumbnail',
      {
        path: 'articles',
        populate: ['thumbnail', 'categories', 'author'],
      },
    ]);

    const popular = await this.CollectionModel.findOne({
      slug: 'popular',
    }).populate([
      'thumbnail',
      {
        path: 'articles',
        populate: ['thumbnail', 'categories', 'author'],
      },
    ]);

    const latest = await this.ArticleModel.find({
      status: EArticleStatus.PUBLIC,
    })
      .limit(20)
      .sort({
        createdAt: -1,
      })
      .populate(['thumbnail', 'categories', 'author']);

    return { topHero, trending, recommend, popular, latest };
  }
}
