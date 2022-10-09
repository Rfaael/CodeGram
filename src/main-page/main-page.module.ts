import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MainPageController } from './main-page.controller';
import { MainPageService } from './main-page.service';

@Module({
    imports: [PrismaModule],
    providers: [MainPageService],
    controllers: [MainPageController]
})
export class MainPageModule {}
