import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ContactService } from './contact.service';
import { ContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: ContactDto) {
    const data = await this.contactService.create(createContactDto);
    return { data };
  }
}
