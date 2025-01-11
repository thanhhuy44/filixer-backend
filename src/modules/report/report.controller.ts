import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@ApiBearerAuth('JWT-Auth')
@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(@Req() req: Request, @Body() createReportDto: CreateReportDto) {
    const user = req.user._id;
    const data = await this.reportService.create(createReportDto, user);
    return { data };
  }

  // @Get()
  // findAll() {
  //   return this.reportService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.reportService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
  //   return this.reportService.update(+id, updateReportDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reportService.remove(+id);
  // }
}
