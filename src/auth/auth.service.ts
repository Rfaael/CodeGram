import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {JwtService} from "@nestjs/jwt"
import { UserLoginDto } from 'src/users/dto/userLogin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { verify } from 'argon2';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService
    ){}


    async login(userLoginDto: UserLoginDto) {
        const {
            email,
            password
        } = userLoginDto;
        //VERIFY IF THE USER EXISTS BY YOUR EMAIL
        const userExists = await this.prismaService.user.findFirst({
            where: {
                email
            }
        });

        if(!userExists) throw new ForbiddenException('User does not exists!');

        //CHECK IF THE PASSWORD IS CORRECT
        const comparePassword = await verify(userExists.password, password);

        if(!comparePassword) throw new ForbiddenException('Credentials are invalid!');

        //SIGN THE JWT TOKEN

        return {
            access_token: this.jwtService.sign({
                sub: userExists.id,
                username: userExists.firstName
            })
        };
    }
}
