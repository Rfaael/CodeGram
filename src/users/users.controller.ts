import { Body, Controller, Post } from '@nestjs/common';
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
}
