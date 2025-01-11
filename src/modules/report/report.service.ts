import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportService {
  @InjectModel(Report.name) private readonly ReportModel: Model<Report>;

  async create(body: CreateReportDto, createdBy: string) {
    const createdReport = await this.ReportModel.create({
      ...body,
      createdBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return createdReport;
  }

  // findAll() {
  //   return `This action returns all report`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} report`;
  // }

  // update(id: number, updateReportDto: UpdateReportDto) {
  //   return `This action updates a #${id} report`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} report`;
  // }
}
