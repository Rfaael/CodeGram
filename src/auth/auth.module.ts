import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {JwtModule} from "@nestjs/jwt";
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [
    JwtModule.register({
      secret: '@Cox!nh4123',
      signOptions: {
        expiresIn: '15m'
      }
    }),
    PrismaModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
