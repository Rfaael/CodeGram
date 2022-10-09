import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/updatePost.dto';
import {v4 as uuid} from "uuid";
import { CreatePostDto } from './dto/createPost.dto';
import { Post } from '@prisma/client';


@Injectable()
export class MainPageService {
    constructor(
        private prismaService: PrismaService
    ) {}

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

    async getAllUsersPosts(): Promise<Post[]> {
        const allPosts = await this.prismaService.post.findMany();

        return allPosts;
    }

    //INTERNAL METHOD
    async getUsersPostsById(userPayLoad: any): Promise<any> {
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
        const usersPosts = await this.getUsersPostsById(userPayLoad);

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
        const usersPosts = await this.getUsersPostsById(userPayLoad);

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
}
