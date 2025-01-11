import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { ContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(@InjectBot() private readonly bot: Telegraf<any>) {}
  async create(body: ContactDto) {
    const { fullName, title, email, message } = body;

    const markdownMessage = `📩📩📩📩📩\n<strong>${title}</strong>\nSubject: <strong>${title}</strong>\nName: <strong>${fullName}</strong>\nEmail: <strong>${email}</strong>\n🗣️\n<code>${message}</code>`;

    try {
      await this.bot.telegram.sendMessage(
        process.env.CONTACT_CHANNEL_ID as string,
        markdownMessage,
        {
          parse_mode: 'HTML',
        },
      );

      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
