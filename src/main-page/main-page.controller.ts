import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/createPost.dto';
import { MakeCommentDto } from './dto/makeComment.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { MainPageService } from './main-page.service';

@Controller('codegram')
export class MainPageController {
    constructor(
        private mainPageService: MainPageService
    ){}

    // ===============//
    // ===> POST =====//
    // ===============//

    @UseGuards(JwtAuthGuard)
    @Post('/posts/create')
    createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
        return this.mainPageService.createPost(createPostDto, req.user);
    }

    @Get('/posts')
    getAllUsersPosts() {
        return this.mainPageService.getAllUsersPosts();
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/posts/update/:id')
    updateUsersPost(@Param('id') postId: string,@Body() updatePostDto: UpdatePostDto, @Req() req: Request) {
        return this.mainPageService.updateUsersPosts(postId, updatePostDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/posts/delete/:id')
    deleteUsersPost(@Param('id') postId: string, @Req() req: Request) {
        return this.mainPageService.deleteUsersPosts(postId, req.user);
    }

    // ====================//
    // ===> COMMENTS =====//
    // ===================//

    @UseGuards(JwtAuthGuard)
    @Post('/posts/:id/comments/create')
    makeCommentOnPost(@Param('id') postId: string, @Body() makeCommentDto: MakeCommentDto, @Req() req: Request) {
        return this.mainPageService.makeCommentOnPost(postId, makeCommentDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/posts/:id/comments/update/:commentId')
    updateCommentOnPost(@Body('commentContent') commentContent: string, @Param('id') postId: string, @Param('commentId') commentId: string, @Req() req: Request) {

    }

    @UseGuards(JwtAuthGuard)
    @Delete('/posts/:id/comments/delete/:commentId')
    deleteCommentOnPost(@Param('id') postId: string, @Param('commentId') commentId: string, @Req() req: Request) {

    }
}
