import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthMiddleware } from '../auth/auth.middleware';
import { AssistantsController } from './assistants.controller';
import { AssistantsService } from './assistants.service';
import {
  AssistantMessage,
  AssistantMessageSchema,
} from './entities/assistant-message.entity';
import {
  AssistantRoom,
  AssistantRoomSchema,
} from './entities/assistant-room.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AssistantRoom.name,
        schema: AssistantRoomSchema,
      },
      {
        name: AssistantMessage.name,
        schema: AssistantMessageSchema,
      },
    ]),
  ],
  controllers: [AssistantsController],
  providers: [AssistantsService],
})
export class AssistantsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/assistants', '/assistants/*');
  }
}
