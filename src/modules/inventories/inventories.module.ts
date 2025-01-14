import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Color, ColorSchema } from '~/colors/entities/color.entity';
import { Product, ProductSchema } from '~/products/entities/product.entity';
import { Size, SizeSchema } from '~/sizes/entities/size.entity';

import { Inventory, InventorySchema } from './entities/inventory.entity';
import { InventoriesController } from './inventories.controller';
import { InventoriesService } from './inventories.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Inventory.name,
        schema: InventorySchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Size.name,
        schema: SizeSchema,
      },
      {
        name: Color.name,
        schema: ColorSchema,
      },
    ]),
  ],
  controllers: [InventoriesController],
  providers: [InventoriesService],
})
export class InventoriesModule {}
