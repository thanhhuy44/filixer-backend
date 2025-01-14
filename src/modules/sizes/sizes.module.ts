import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Size, SizeSchema } from './entities/size.entity';
import { SizesController } from './sizes.controller';
import { SizesService } from './sizes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Size.name,
        schema: SizeSchema,
      },
    ]),
  ],
  controllers: [SizesController],
  providers: [SizesService],
})
export class SizesModule {}
