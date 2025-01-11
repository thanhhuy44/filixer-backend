import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PaginationDto } from '@/common/dto/pagination.dto';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@ApiBearerAuth('JWT-Auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const data = await this.usersService.findAll(pagination);
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(id);
    return { data };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const data = await this.usersService.update(id, body);
    return { data };
  }
}
