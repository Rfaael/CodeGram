import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/updatePost.dto';
import {v4 as uuid} from "uuid";
import { CreatePostDto } from './dto/createPost.dto';
import { Post } from '@prisma/client';
import { MakeCommentDto } from './dto/makeComment.dto';


@Injectable()
export class MainPageService {
    constructor(
        private prismaService: PrismaService
    ) {}
    // ================//
    // ===> POSTS =====//
    // ================//
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
        const allPosts = await this.prismaService.post.findMany({
            include: {
                comments: true,
                likes: true,
            }
        });

        //HAVE TO RETURN ALL COMMENTS AND LIKES RELATED ON THOSE POST

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

    // ====================//
    // ===> COMMENTS =====//
    // ===================//

    async makeCommentOnPost(postId: string, makeCommentDto: MakeCommentDto, userPayload: any): Promise<void> {
        const {userId} = userPayload;

        // CHECK IF THE POSTID IS AN EXISTING POST
        const postExists = await this.prismaService.post.findFirst({
            where: {
                id: postId
            }
        });

        if(!postExists) throw new ForbiddenException('Post does not exists');

        //CREATE THE COMMENT
        const commentOnPost = await this.prismaService.relationCommentsPost.create({
            data: {
                id: uuid(),
                postId,
                authorId: userId,
                commentContent: makeCommentDto.commentContent
            }
        });

        return;
    }

    async updateCommentOnPost(commentContent: string, postId: string, commentId: string, userPayLoad: any): Promise<void> {
        const {userId} = userPayLoad;

        //CHECK IF THE COMMENT BELONGS TO THE USER
        const commentBelongTest = await this.prismaService.relationCommentsPost.findFirst({
            where: {
                id: commentId
            }
        });

        const commentBelongUser = commentBelongTest.authorId == userId;

        if(!commentBelongUser) throw new ForbiddenException('This comment does not belong to this user.');

        //CHECK IF THE COMMENT BELONGS TO THE POST
        const commentBelongPost = commentBelongTest.postId === postId;

        if(!commentBelongPost) throw new ForbiddenException('This comment does not belongs to this post!');

        const updateComment = await this.prismaService.relationCommentsPost.update({
            where: {
                id: commentId
            },
            data: {
                commentContent
            }
        });
        

        return;
    }

    async deleteCommentOnPost(postId: string, commentId: string, userPayLoad: any): Promise<void> {
        const {userId} = userPayLoad;

        //CHECK IF THE COMMENT BELONGS TO THE USER

        const commentBelongsUser = await this.prismaService.relationCommentsPost.findFirst({
            where: {
                id: commentId
            }
        });

        const commentsBelongsUsersTest = commentBelongsUser.authorId === userId;

        if(!commentsBelongsUsersTest) throw new ForbiddenException('This comment does not belongs to this user!');

        const deletedComment = await this.prismaService.relationCommentsPost.delete({
            where: {
                id: commentId
            }
        });

        return;
    }

    // ================//
    // ===> LIKES =====//
    // ================//

    async likeOnPost(postId: string, userPayload: any) {
        const {userId} = userPayload;

        //CHECK IF THE POST EXISTS
        const postExists = await this.prismaService.post.findFirst({
            where: {
                id: postId
            }
        });

        if(!postExists) throw new ForbiddenException('Post does not exists');

        const like = await this.prismaService.relationLikesPost.create({
            data: {
                id: uuid(),
                authorId: userId,
                postId
            }
        });

        return like;
    }

    async deleteLikeOnPost(postId: string, likeId: string, userPayload: any): Promise<void> {
        const {userId} = userPayload;

        //CHECK IF THE POST EXISTS
        const postExists = await this.prismaService.post.findFirst({
            where: {
                id: postId
            }
        });

        if(!postExists) throw new ForbiddenException('Post does not exists');


        const belongLikeTest = await this.prismaService.relationLikesPost.findFirst({
            where: {
                id: likeId
            }
        });

        //CHECK IF THE LIKE EXISTS
        if(!belongLikeTest) throw new ForbiddenException('Like does not exists on this post.');

        //CHECK IF THE LIKE BELONGS TO THE USER
        const likeBelongsUser = belongLikeTest.authorId === userId;
        
        if(!likeBelongsUser)throw new ForbiddenException('This like does not belongs to this user.');

        //CHECK IF THE LIKE BELONGS TO THE POST
        const likeBelongsPost = belongLikeTest.postId === postId;

        if(!likeBelongsPost)throw new ForbiddenException('This like does not belongs to this post.');

        const deletedLike = await this.prismaService.relationLikesPost.delete({
            where: {
                id: likeId
            }
        })
        
        return;
    }
}
