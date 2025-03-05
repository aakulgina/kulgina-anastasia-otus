import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/CreateUser.dto';
import { User } from './user.entity';
import { ChangeUserPasswordRequestDto } from './dto/ChangeUserPassword.request.dto';
import { ChangeUserProfileRequestDto } from './dto/ChangeUserProfile.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    private users: Array<any> = [];

    createNewUser(user: CreateUserDto) {
        const payload = {
            id: Date.now(),
            ...user,
            solutions: [],
            lastSeen: new Date(),
        }

        // TODO import validate from class-validator
        // e.g. const errors = await validate(payload)

        this.users.push(payload);

        return payload;
    }

    findUserByEmail(email: string) {
        return this.users.find(user => user.email === email);
    }

    findUserByUserName(userName: string) {
        return this.users.find(user => user.userName === userName);
    }

    getUserById(id: number) {
        const user = this.users.find(user => user.id === id);

        if (!user) {
            throw new NotFoundException();
        }

        try {
            return user;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    changeUserProfile(id: number, payload: ChangeUserProfileRequestDto) {
        // TODO Would be nice to validate somehow
        if (Object.values(payload).every(value => !value)) {
            throw new BadRequestException('At least one filed have to be filled');
        }

        const user = this.getUserById(id);

        if (!user) {
            throw new UnauthorizedException();
        }

        try {
            this.users[this.users.indexOf(user)] = {
                ...user,
                ...payload,
            }

            return this.users[this.users.indexOf(user)];
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async changeUserPassword(id:number, payload: ChangeUserPasswordRequestDto) {
        // TODO Would be nice to validate somehow
        if (!payload) {
            throw new BadRequestException();
        }

        const user = this.getUserById(id);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isCurrentPasswordValid = await bcrypt.compare(payload.currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException('Invalid current password');
        }

        try {
            const hashedNewPassword = await bcrypt.hash(payload.newPassword, 10);
            
            this.users[this.users.indexOf(user)] = {
                ...user,
                password: hashedNewPassword,
            }
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    deleteUserById(id: number) {
        // TODO Would be nice to validate somehow
        if (!id) {
            throw new UnauthorizedException();
        }

        try {
            this.users = this.users.filter((user) => user.id !== id);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
