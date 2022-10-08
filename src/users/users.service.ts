import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import {v4 as uuid} from "uuid";
import {hash} from "argon2";
import { User, Post } from '@prisma/client';
import { UserLoginDto } from './dto/userLogin.dto';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

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
                postsList: true
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

    async createPost(createPostDto: CreatePostDto, userPayload: any): Promise<Post> {
        const {userId} = userPayload;
        const post = await this.prismaService.post.create({
            data: {
                id: uuid(),
                authorId:userId,
                ...createPostDto
            }
        });

        return post;
    }

    async getUsersPosts(userPayLoad: any): Promise<any> {
        const {userId} = userPayLoad;

        const userPosts = await this.prismaService.post.findMany({
            where: {
                authorId: userId
            }
        });

        if(userPosts.length === 0) return {message: 'The user does not have a post yet!'};

        return userPosts;
    }

    async updateUsersPosts(postId: string, updatePostDto: UpdatePostDto, userPayLoad: any): Promise<any> {
        if(!postId) throw new ForbiddenException('The post id is not provided!');

        //CHECK IF THE POST BELONGS TO THE USER
        const usersPosts = await this.getUsersPosts(userPayLoad);

        const postBelongsUser = usersPosts.filter((post) => post.id === postId);

        if(postBelongsUser.length === 0) throw new ForbiddenException('This post does not belong to this user!');

        const post = await this.prismaService.post.update({
            where: {
                id: postId,
            },
            data: {
                ...updatePostDto
            }
        });

        return post;
    }   

    async deleteUsersPosts(postId: string, userPayLoad: any): Promise<void> {
        if(!postId) throw new ForbiddenException('The post id is not provided!');

        //CHECK IF THE POST BELONGS TO THE USER
        const usersPosts = await this.getUsersPosts(userPayLoad);

        const postBelongsUser = usersPosts.filter((post) => post.id === postId);

        //CHECK IF THE POST EXISTS
        if(postBelongsUser.length === 0) throw new ForbiddenException('This post does not belong to this user!');

        const post = await this.prismaService.post.delete({
            where: {
                id: postId
            }
        });

        return;
    }

    login(userLoginDto: UserLoginDto) {
        return this.authService.login(userLoginDto);
    }
}
