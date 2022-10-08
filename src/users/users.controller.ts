import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { UserLoginDto } from './dto/userLogin.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ){}

    @Post('/create')
    createUserProfile(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUserProfile(createUserDto);
    }

    @Post('/login')
    login(@Body() userLoginDto: UserLoginDto) {
        return this.usersService.login(userLoginDto);
    }


    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getUsersProfile(@Req() req: Request) {
        return this.usersService.getUsersProfileById(req.user);
    }
}
