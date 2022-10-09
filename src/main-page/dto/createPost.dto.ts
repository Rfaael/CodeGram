import {IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    photo: string;
}