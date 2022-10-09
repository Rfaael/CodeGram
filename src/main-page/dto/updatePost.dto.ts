import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePostDto {
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    photo: string;
}