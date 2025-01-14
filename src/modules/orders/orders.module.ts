import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Inventory,
  InventorySchema,
} from '~/inventories/entities/inventory.entity';
import { Product, ProductSchema } from '~/products/entities/product.entity';

import { Order, OrderSchema } from './entities/order.entity';
import { OrderItem, OrderItemSchema } from './entities/order-item.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: OrderItem.name,
        schema: OrderItemSchema,
      },
      {
        name: Inventory.name,
        schema: InventorySchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
})
export class OrdersModule {}
