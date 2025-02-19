import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { EChatRoomType } from '@/types/enum';

class RoomMemberDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  nickname: string;
}

export class CreateRoomDto {
  @ApiProperty({})
  @ValidateNested({ each: true })
  @IsArray({})
  @IsNotEmpty()
  @Type(() => RoomMemberDto)
  members: RoomMemberDto[];

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  @IsEnum(EChatRoomType)
  type: string;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  name: string;
}
