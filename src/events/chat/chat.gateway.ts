import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('🚀 ~ ChatGateway ~ handleMessage ~ payload:', payload);
    console.log('🚀 ~ ChatGateway ~ handleMessage ~ client:', client);
    return 'Hello world 1!';
  }
}
