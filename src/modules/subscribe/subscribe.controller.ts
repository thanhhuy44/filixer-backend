import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { UpdateSubscribeDto } from './dto/update-subscribe.dto';
import { SubscribeService } from './subscribe.service';

@ApiTags('Subscribe')
@ApiBearerAuth('JWT-Auth')
@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  async create(@Body() body: CreateSubscribeDto) {
    const data = await this.subscribeService.create(body);
    return { data };
  }

  @Get()
  findAll() {
    return this.subscribeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscribeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscribeDto: UpdateSubscribeDto,
  ) {
    return this.subscribeService.update(+id, updateSubscribeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscribeService.remove(+id);
  }
}
