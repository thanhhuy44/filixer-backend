import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SendEmailDto } from './dto/send-email.dto';
import { MailerService } from './mailers.service';

@ApiTags('Mailer')
@ApiBearerAuth('JWT-Auth')
@Controller('mailers')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  async create(@Body() body: SendEmailDto) {
    const data = await this.mailerService.create(body);
    return { data };
  }
}
