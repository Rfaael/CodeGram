import { IsNotEmpty, IsString } from "class-validator";

export class MakeCommentDto {
    @IsNotEmpty()
    @IsString()
    commentContent: string;

}