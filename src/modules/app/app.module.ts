import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';

import { CategoriesModule } from '~/article-categories/categories.module';
import { CollectionsModule } from '~/article-collections/collections.module';
import { CommentsModule } from '~/article-comments/comments.module';
import { HomeModule } from '~/article-home/home.module';
import { ArticlesModule } from '~/articles/articles.module';
import { AssetsModule } from '~/assets/assets.module';
import { AssistantsModule } from '~/assistants/assistants.module';
import { AuthMiddleware } from '~/auth/auth.middleware';
import { AuthModule } from '~/auth/auth.module';
import { ColorsModule } from '~/colors/colors.module';
import { ContactModule } from '~/contact/contact.module';
import { InventoriesModule } from '~/inventories/inventories.module';
import { MailerModule } from '~/mailers/mailers.module';
import { OrdersModule } from '~/orders/orders.module';
import { ProductsModule } from '~/products/products.module';
import { ReportModule } from '~/report/report.module';
import { ShopCollectionsModule } from '~/shop-collections/collections.module';
import { SizesModule } from '~/sizes/sizes.module';
import { SubscribeModule } from '~/subscribe/subscribe.module';
import { UsersModule } from '~/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValidateHostNameMiddleware } from './host.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_CONTACT_TOKEN,
      launchOptions: false,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      allowPartialTrustChain: true,
    }),
    //
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
    // shop
    ShopCollectionsModule,
    ColorsModule,
    SizesModule,
    ProductsModule,
    InventoriesModule,
    OrdersModule,

    //
    AssistantsModule,

    // Chat

    // Mailer
    MailerModule,
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
      '/assets',
      '/assets/*',
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
