import { BadRequestException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/CreateUser.dto';
import { User } from './user.entity';
import { ChangeUserPasswordRequestDto } from './dto/ChangeUserPassword.request.dto';
import { ChangeUserProfileRequestDto } from './dto/ChangeUserProfile.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        private readonly jwtService: JwtService,

        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    saveUser(user: CreateUserDto): Promise<User> {
        return this.usersRepository.save(user);
    }

    findUserByEmail(email: string) {
        return this.usersRepository.findOneBy({ email });
    }

    findUserByUserName(userName: string) {
        return this.usersRepository.findOneBy({ userName });
    }

    async getVerifiedUser(accessToken: string, userName: string) {
        const { email } = this.jwtService.verify(accessToken, {
            // TODO
            secret: 'Here gonna be some env var or etc',
        });

        const user = await this.findUserByEmail(email);

        if (!user || user.userName !== userName) {
            throw new UnauthorizedException('User does not match');
        }

        return user;
    }

    async updateUserLoginInfo(accessToken: string, userName: string) {
        try {
            const user = await this.getVerifiedUser(accessToken, userName);

            this.usersRepository.save({
                ...user,
                lastSeen: new Date(),
            })
        } catch (error) {
            if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
        }
    }

    async changeUserInfo(userName: string, accessToken: string, payload: ChangeUserProfileRequestDto) {
        if (Object.values(payload).every(value => !value)) {
            throw new BadRequestException('No changes provided');
        }

        if (payload.userName) {
            const userNameAlreadyExists = Boolean(await this.findUserByUserName(payload.userName));

            if (userNameAlreadyExists) {
                throw new BadRequestException('User name already exists');
            }
        }

        try {
            const user = await this.getVerifiedUser(accessToken, userName);

            return this.saveUser({ ...user, ...payload })
        } catch (error) {
            if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
        }
    }

    async changeUserPassword(userName: string, accessToken: string, payload: ChangeUserPasswordRequestDto) {
        const user = await this.getVerifiedUser(accessToken, userName);

        const isCurrentPasswordValid = await bcrypt.compare(payload.currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException('Invalid current password');
        }

        if (payload.currentPassword === payload.newPassword) {
            throw new BadRequestException('New password should differ from the current one')
        }

        try {
            const hashedNewPassword = await bcrypt.hash(payload.newPassword, 10);
            
            this.saveUser({
                ...user,
                password: hashedNewPassword,
            })
        } catch (error) {
            if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
        }
    }

    async deleteUser(userName: string, accessToken: string) {
        try {
            const user = await this.getVerifiedUser(accessToken, userName);

            this.usersRepository.remove(user);
        } catch (error) {
            if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
        }
    }
}
