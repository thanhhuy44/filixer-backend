import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  thumbnails: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  originPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  inventory: number;

  @ApiProperty({
    default: [
      {
        size: 'string',
        color: 'string',
        amout: 0,
        price: 0,
      },
    ],
  })
  variants: InventoryDto[];
}

class InventoryDto {
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

  @ApiProperty({
    required: true,
    minimum: 0,
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}
