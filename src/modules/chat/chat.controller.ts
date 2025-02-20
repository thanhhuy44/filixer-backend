import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { MongoIdDto } from '@/common/dto/mongo-params.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ReactionMessageDto } from './dto/reaction-message';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Chat')
@ApiBearerAuth('JWT-Auth')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('online')
  async get(@Body() body: UpdateStatusDto, @Req() req: Request) {
    const data = await this.chatService.online(req.user._id, body.status);
    return { data };
  }

  @Post('rooms')
  async createRoom(@Body() body: CreateRoomDto, @Req() req: Request) {
    const data = await this.chatService.createRoom(body, req.user._id);
    return { data };
  }

  @Get('rooms')
  async getRoom(@Query() pagination: PaginationDto, @Req() req: Request) {
    const data = await this.chatService.getRooms(pagination, req.user._id);
    return data;
  }

  @Delete('rooms/:id')
  async deleteRoom(@Param() param: MongoIdDto, @Req() req: Request) {
    const data = await this.chatService.deleteRoom(param.id, req.user._id);
    return { data };
  }

  @Post('messages/send')
  async sendMessage(@Body() body: SendMessageDto, @Req() req: Request) {
    const data = await this.chatService.sendMessage(body, req.user._id);
    return { data };
  }

  @Patch('messages/:id/read')
  async readMessage(@Param() param: MongoIdDto, @Req() req: Request) {
    const data = await this.chatService.readMessage(param.id, req.user._id);
    return { data };
  }

  @Patch('messages/:id/reaction')
  async reactionMessage(
    @Param() param: MongoIdDto,
    @Body() body: ReactionMessageDto,
    @Req() req: Request,
  ) {
    const data = await this.chatService.reactionMessage(
      param.id,
      body.emoji,
      req.user._id,
    );
    return { data };
  }
}
