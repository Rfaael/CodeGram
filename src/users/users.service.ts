import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import {v4 as uuid} from "uuid";
import {hash} from "argon2";
import { User, Post } from '@prisma/client';
import { UserLoginDto } from './dto/userLogin.dto';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreatePostDto } from '../main-page/dto/createPost.dto';
import { UpdatePostDto } from '../main-page/dto/updatePost.dto';

@Injectable()
export class UsersService {
    constructor(
        private prismaService: PrismaService,
        private authService: AuthService
    ) {}


    async createUserProfile(createUserDto: CreateUserDto): Promise<User | ForbiddenException> {
        const {
            password,
            email,
            yearBirth
        } = createUserDto;

        //VERIFY IF THE USER HAVE MORE THAN 16 YEARS OLD
        if(yearBirth < 16) throw new ForbiddenException(`You don't have enough age!`);

        //VERIFY IF THE EMAIL IS ALREDY IN USE
        const emailAlredyInUse = await this.prismaService.user.findFirst({
            where: {
                email
            }
        });

        if(emailAlredyInUse) throw new ForbiddenException('Put a valid e-mail!');

        //HASH THE PASSWORD BEFORE SAVE IT  
        const passwordHash = await hash(password);
        
        //CREATE THE USER PROFILE
        const userProfile = await this.prismaService.user.create({
            data: {
                ...createUserDto,
                id: uuid(),
                password: passwordHash,
            }
        });

        return userProfile;
    }

    async getUsersProfile(userPayload: any): Promise<any> {
        const {userId} = userPayload;

        const userProfile = await this.prismaService.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                created_at: true,
                updated_at: true,
                postsList: true,
                frindsListRequest: true,
                friendsListReceived: true
            }
        });

        return userProfile;
    }

    async updateUsersProfile(updateUserDto: UpdateUserDto,userPayload: any): Promise<any>{
        const {userId} = userPayload;

        const user = await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                ...updateUserDto
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                created_at: true,
                updated_at: true
            }
        });
        

        return user;
    }

    async deleteUsersProfile(userPayLoad: any): Promise<any> {
        const {userId} = userPayLoad;

        const user = await this.prismaService.user.delete({
            where: {
                id: userId
            }
        });

        return user;
    }

    //
    // SEND A FRIENDSHIP REQUEST
    //

    async sendFriendshipRequest(toUserId: string, userPayload: any): Promise<void> {
        const {userId} = userPayload;
        //CHECK IF THE USER EXISTS  
        const userExists = await this.prismaService.user.findFirst({
            where:{
                id: userId
            }
        });
        
        if(!userExists) throw new ForbiddenException('User does not exists');

        const friendship = await this.prismaService.friendshipRequest.create({
            data: {
                id: uuid(),
                toUserId: toUserId,
                fromUserId: userId
            }
        });

        return;
    }

    login(userLoginDto: UserLoginDto) {
        return this.authService.login(userLoginDto);
    }
}
