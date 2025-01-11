import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';

import { ArticlesModule } from '~/articles/articles.module';
import { AssetsModule } from '~/assets/assets.module';
import { AuthMiddleware } from '~/auth/auth.middleware';
import { AuthModule } from '~/auth/auth.module';
import { CategoriesModule } from '~/categories/categories.module';
import { CollectionsModule } from '~/collections/collections.module';
import { CommentsModule } from '~/comments/comments.module';
import { ContactModule } from '~/contact/contact.module';
import { HomeModule } from '~/home/home.module';
import { ReportModule } from '~/report/report.module';
import { SubscribeModule } from '~/subscribe/subscribe.module';
import { UsersModule } from '~/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValidateHostNameMiddleware } from './host.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_CONTACT_TOKEN,
      launchOptions: false,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {}),
    HomeModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ArticlesModule,
    CollectionsModule,
    CommentsModule,
    AssetsModule,
    SubscribeModule,
    ContactModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateHostNameMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes(
      {
        method: RequestMethod.POST,
        path: '/articles',
      },
      {
        method: RequestMethod.POST,
        path: '/collections',
      },
      {
        method: RequestMethod.PATCH,
        path: '/articles',
      },
      '/comments',
      '/comments/*',
      '/report',
      '/report/*',
      {
        method: RequestMethod.POST,
        path: '/assets/**',
      },
      {
        method: RequestMethod.GET,
        path: '/subscribe/**',
      },
      {
        method: RequestMethod.PATCH,
        path: '/subscribe/**',
      },
      {
        method: RequestMethod.DELETE,
        path: '/subscribe/**',
      },
    );
  }
}
