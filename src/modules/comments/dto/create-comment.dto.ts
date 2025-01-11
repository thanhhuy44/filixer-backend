import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  article: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsMongoId()
  parent: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
