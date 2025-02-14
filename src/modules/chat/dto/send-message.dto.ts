import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { EChatMessageType } from '@/types/enum';

export class SendMessageDto {
  @IsString()
  @IsMongoId()
  @IsOptional()
  @ApiProperty({})
  room?: string;

  @IsString()
  @IsNotEmpty()
  @IsString()
  @IsEnum(EChatMessageType)
  @ApiProperty({
    default: EChatMessageType.TEXT,
  })
  type: string;

  @IsString()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({})
  text: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  @ApiProperty({})
  images: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  @ApiProperty({})
  rooms: string;
}
