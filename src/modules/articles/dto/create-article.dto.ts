import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  thumbnail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  categories: string[];

  @ApiProperty({
    isArray: true,
    type: 'array',
    items: {
      type: 'string',
    },
    default: ['keyword-1', 'keyword-2'],
  })
  @IsOptional()
  @IsArray()
  keywords: string[];
}
