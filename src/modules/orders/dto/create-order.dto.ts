import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { EPaymentMethod } from '@/types/enum';

export class CreateOrderDto {
  @ApiProperty({
    default: [
      {
        product: '',
        variant: '',
        amount: 1,
      },
    ],
  })
  @IsArray()
  orderProducts: OrderItemDto[];

  @ApiProperty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty()
  @IsOptional()
  user?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  recipientName: string;

  @ApiProperty()
  @IsOptional()
  country?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  wardOrCommune: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  shippingNote: string;

  @ApiProperty({
    default: EPaymentMethod.COD,
  })
  @IsNotEmpty()
  @IsEnum(EPaymentMethod)
  paymentMethod: string;
}

export class OrderItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  product: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  variant: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}
