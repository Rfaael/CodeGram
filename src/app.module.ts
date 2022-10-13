import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MainPageController } from './main-page/main-page.controller';
import { MainPageService } from './main-page/main-page.service';
import { MainPageModule } from './main-page/main-page.module';
import { ChatGatewayModule } from './chat-gateway/chat-gateway.module';

@Module({
  imports: [UsersModule, MainPageModule, ChatGatewayModule],
  controllers: [],
  providers: [AuthModule],
})
export class AppModule {}
