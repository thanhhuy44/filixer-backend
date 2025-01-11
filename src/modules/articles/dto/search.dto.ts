import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { PaginationDto } from '@/common/dto/pagination.dto';

export class SearchDto extends PaginationDto {
  @ApiProperty({
    default: '',
  })
  @IsNotEmpty()
  keyword: string;
}
