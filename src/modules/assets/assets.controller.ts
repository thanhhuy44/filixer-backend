import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { PaginationDto } from '@/common/dto/pagination.dto';

import { AssetsService } from './assets.service';

@ApiTags('Asset')
@ApiBearerAuth('JWT-Auth')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const user = req.user._id;
    const data = await this.assetsService.uploadOnefile(file, user);
    return { data };
  }

  @Post('upload/multiple')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const user = req.user._id;
    const data = await this.assetsService.uploadMultipleFiles(files, user);
    return { data };
  }

  @Get()
  async getAll(@Query() pagination: PaginationDto) {
    const data = await this.assetsService.getAll(pagination);
    return data;
  }

  @Get('me')
  async getMe(@Query() pagination: PaginationDto, @Req() req: Request) {
    const data = await this.assetsService.getMe(pagination, req.user._id);
    return data;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.assetsService.delete(id);
    return { data };
  }
}
