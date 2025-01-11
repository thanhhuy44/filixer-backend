import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ReportTargetType } from '@/types/enum';

export class CreateReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  target: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(ReportTargetType)
  targetType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reason: string;
}
