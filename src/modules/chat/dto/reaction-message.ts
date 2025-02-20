import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReactionMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  emoji: string;
}
