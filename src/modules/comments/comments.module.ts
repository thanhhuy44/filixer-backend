import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Article, ArticleSchema } from '~/articles/entities/article.entity';
import { User, UserSchema } from '~/users/entities/user.entity';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './entities/comment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Article.name,
        schema: ArticleSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
