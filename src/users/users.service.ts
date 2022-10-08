import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import {v4 as uuid} from "uuid";
import {hash, verify} from "argon2";
import { User } from '@prisma/client';
import { UserLoginDto } from './dto/userLogin.dto';

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
                ...createUserDto,
                id: uuid(),
                password: passwordHash,
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

        return 'Logeed';
    }
}
