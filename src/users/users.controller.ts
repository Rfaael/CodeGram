import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from '../main-page/dto/createPost.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePostDto } from '../main-page/dto/updatePost.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserLoginDto } from './dto/userLogin.dto';
import { UsersService } from './users.service';
import { EventsGateway } from 'src/chat-gateway/events.gateway';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ){}

    @Post('/create')
    createUserProfile(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUserProfile(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getUsersProfile(@Req() req: Request) {
        return this.usersService.getUsersProfile(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/update')
    updateUsersProfile(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
        return this.usersService.updateUsersProfile(updateUserDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/delete')
    deleteUsersProfile(@Req() req: Request) {
        return this.usersService.deleteUsersProfile(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/friends')
    getAllFriends(@Req() req: Request) {
        return this.usersService.getAllFriends(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/friends/request')
    sendFriendshipRequest(@Body('id') id: string, @Req() req: Request) {
        return this.usersService.sendFriendshipRequest(id, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/friends/request/response/:id')
    acceptFriendshipRequest(@Param('id') requestId: string, @Req() req: Request) {
        return this.usersService.acceptFriendshipRequest(requestId, req.user);
    }

    @Post('/login')
    login(@Body() userLoginDto: UserLoginDto) {
        return this.usersService.login(userLoginDto);
    }
}
