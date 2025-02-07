import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AskDto {
  @IsString()
  @IsMongoId()
  @IsOptional()
  @ApiProperty({})
  room: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({})
  content: string;
}
