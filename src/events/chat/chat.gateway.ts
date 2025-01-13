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
  namespace: 'chat',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('test')
  handleMessage(client: any, payload: any): string {
    console.log('🚀 ~ ChatGateway ~ handleMessage ~ payload:', payload);
    return 'Hello world 1!';
  }
}
