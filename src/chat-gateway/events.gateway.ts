import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server } from "http";


@WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
export class EventsGateway {
    @WebSocketServer()
    server: Server;


    @SubscribeMessage('message')
    handleMessage(@MessageBody() messageBody: string, @ConnectedSocket() client: Socket) {
        // console.log(client);
        console.log(messageBody)
        return;
    }

}