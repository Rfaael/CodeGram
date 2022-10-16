import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
// import { Socket } from "dgram";
import { Server } from "http";
import {Socket} from "socket.io";

@WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
export class EventsGateway {
    @WebSocketServer()
    server: Server;


    @SubscribeMessage('sendMessage')
    handleMessage(@MessageBody() messageBody: any, @ConnectedSocket() client: Socket) {
      this.server.emit('geralMessage', messageBody);
      return;
    }

    @SubscribeMessage('createRoom')
    createRoom(socket: Socket, data: string) {
      //MAKE A NEW ROOM
      socket.join(data);
      return;
    }

    @SubscribeMessage('messageRoom')
    sendMessageInRoom(socket: Socket, data: any) {
      const {roomId, msgValue} = data;

      if(roomId == "")   {
        socket.broadcast.emit('receive-message-geral', msgValue)
      }else {
        socket.to(roomId).emit(`message-from-room`, msgValue)
      }
    }
}