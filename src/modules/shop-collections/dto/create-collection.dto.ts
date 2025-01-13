import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'Collection name',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'Collection description',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'Collection thumbnail',
  })
  thumbnail: string;

  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    default: ['product-id-1', 'product-id-2'],
    type: 'array',
    items: {
      type: 'string',
    },
  })
  products: string[];
}
