/* eslint-disable simple-import-sort/imports */
import { MailerModule as NodeMailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthMiddleware } from '../auth/auth.middleware';
import { MailerController } from './mailers.controller';
import { MailerService } from './mailers.service';

@Module({
  imports: [
    NodeMailerModule.forRoot({
      transport: {
        transport: {
          host: process.env.MAIL_HOST, // Change this for other email providers
          port: process.env.MAIL_PORT,
          secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS, // Use App Password if using Gmail
          },
        },
        defaults: {
          from: 'Mailer Test',
        },
      },
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/mailers', '/mailers/*');
  }
}
