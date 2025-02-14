import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsMongoId()
  @IsOptional()
  @ApiProperty({})
  room: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  @ApiProperty({})
  role?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({})
  content: string;
}
