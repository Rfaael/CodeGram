import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import {v4 as uuid} from "uuid";
import {hash, verify} from "argon2";
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(
        private prismaService: PrismaService
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
                id: uuid(),
                password: passwordHash,
                ...createUserDto
            }
        });

        return userProfile;
    }

    getUserById() {
        
    }

    updateUserById() {

    }

    deleteUserById() {

    }
}
