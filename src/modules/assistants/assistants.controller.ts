import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Readable } from 'stream';

import { MongoIdDto } from '@/common/dto/mongo-params.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { EAssistantRole } from '@/types/enum';

import { AssistantsService } from './assistants.service';
import { AskDto } from './dto/ask.dto';

@ApiTags('Assistant')
@ApiBearerAuth('JWT-Auth')
@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Post()
  async create(@Body() body: AskDto, @Req() req: Request) {
    const data = await this.assistantsService.sendMessage(body, req.user._id);
    return { data };
  }

  @Get('rooms/:id/stream')
  async streamChat(
    @Param() param: MongoIdDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const stream = new Readable({
      read() {},
    });

    stream.pipe(res);

    const response = await this.assistantsService.stream(param.id);
    let content = '';
    for await (const chunk of response) {
      content = content + chunk.choices[0]?.delta?.content || '';
      stream.push(chunk.choices[0]?.delta?.content || '');
    }
    if (content) {
      await this.assistantsService.sendMessage(
        { room: param.id, content, role: EAssistantRole.ASSISTANT },
        req.user._id,
      );
    }
    stream.push(null); // Close stream
  }

  @Get('rooms/:id/gemini-stream')
  async geminiStreamChat(
    @Param() param: MongoIdDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const stream = new Readable({
      read() {},
    });

    stream.pipe(res);

    const response = await this.assistantsService.geminiStream(param.id);
    console.log('🚀 ~ AssistantsController ~ response:', response);
    let content = '';
    for await (const chunk of response.stream) {
      content = content + chunk.text() || '';
      stream.push(chunk.text() || '');
    }
    if (content) {
      await this.assistantsService.sendMessage(
        { room: param.id, content, role: EAssistantRole.ASSISTANT },
        req.user._id,
      );
    }
    stream.push(null); // Close stream
  }

  @Get('rooms')
  async getRooms(@Req() req: Request, @Query() query: PaginationDto) {
    const data = await this.assistantsService.getRooms(req.user._id, query);
    return data;
  }
  @Get('rooms/:id')
  async getRoom(@Param() param: MongoIdDto) {
    const data = await this.assistantsService.getRoomById(param.id);
    return { data };
  }

  @Get('rooms/:id/messages')
  async getMessages(
    @Req() req: Request,
    @Param() params: MongoIdDto,
    @Query() query: PaginationDto,
  ) {
    return await this.assistantsService.getMessages(
      params.id,
      req.user._id,
      query,
    );
  }
}
