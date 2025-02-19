import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
