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

import { PaginationDto } from '@/common/dto/pagination.dto';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiBearerAuth('JWT-Auth')
@ApiTags('Comment')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const user = req.user._id;
    const data = await this.commentsService.create(createCommentDto, user);
    return { data };
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const data = await this.commentsService.findAll(pagination);
    return data;
  }

  @Patch('like/:id')
  async like(@Req() req: Request, @Param('id') id: string) {
    const user = req.user._id;
    const data = await this.commentsService.like(id, user);
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateCommentDto,
  ) {
    const user = req.user._id;
    const data = this.commentsService.update(id, user, body);
    return { data };
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user._id;
    const data = await this.commentsService.remove(id, user);
    return { data };
  }
}
