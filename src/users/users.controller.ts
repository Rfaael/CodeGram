import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/createPost.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
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
    @Post('/posts/create')
    createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
        return this.usersService.createPost(createPostDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/posts')
    getUsersPosts(@Req() req: Request) {
        return this.usersService.getUsersPosts(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/posts/update/:id')
    updateUsersPost(@Param('id') postId: string,@Body() updatePostDto: UpdatePostDto, @Req() req: Request) {
        return this.usersService.updateUsersPosts(postId, updatePostDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/posts/delete/:id')
    deleteUsersPost(@Param('id') postId: string, @Req() req: Request) {
        return this.usersService.deleteUsersPosts(postId, req.user);
    }

    @Post('/login')
    login(@Body() userLoginDto: UserLoginDto) {
        return this.usersService.login(userLoginDto);
    }
}
