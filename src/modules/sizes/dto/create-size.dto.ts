import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ESizeType } from '@/types/enum';

export class CreateSizeDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsEnum(ESizeType)
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
