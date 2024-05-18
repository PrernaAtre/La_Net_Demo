import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';


@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: 'http://localhost:3000',
  },
})

@WebSocketGateway()
export class NotificationsGateway {

  @WebSocketServer()
  socket: Socket;
}
