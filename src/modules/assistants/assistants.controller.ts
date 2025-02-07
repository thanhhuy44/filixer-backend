import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { MongoIdDto } from '@/common/dto/mongo-params.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

import { AssistantsService } from './assistants.service';
import { AskDto } from './dto/ask.dto';

@ApiTags('Assistant')
@ApiBearerAuth('JWT-Auth')
@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Post()
  async create(@Body() body: AskDto, @Req() req: Request) {
    const data = await this.assistantsService.create(body, req.user._id);
    return { data };
  }

  @Get('rooms')
  async getRooms(@Req() req: Request) {
    const data = await this.assistantsService.getRooms(req.user._id);
    return { data };
  }

  @Get('rooms/:id/messages')
  async getMessages(
    @Req() req: Request,
    @Param() params: MongoIdDto,
    @Query() query: PaginationDto,
  ) {
    const data = await this.assistantsService.getMessages(
      params.id,
      req.user._id,
      query,
    );
    return { data };
  }
}
