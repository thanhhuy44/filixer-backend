/* eslint-disable simple-import-sort/imports */
import { MailerService as NodeMailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NodeMailerService) {}
  async create(body: SendEmailDto) {
    try {
      await this.mailerService.sendMail({
        to: body.email,
        subject: 'Nodemailer Test Example',
        text: body.content,
      });
      return 'Success!';
    } catch (error) {
      console.error('🚀 ~ MailerService ~ create ~ error:', error);
      throw new InternalServerErrorException();
    }
  }
}
