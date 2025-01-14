import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  product: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  size: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  color: string;

  @ApiProperty({
    required: true,
    minimum: 0,
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;
}
