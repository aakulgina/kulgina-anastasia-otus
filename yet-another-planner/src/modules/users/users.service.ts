import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/CreateUser.dto';
import { User } from './user.entity';
import { ChangeUserPasswordRequestDto } from './dto/ChangeUserPassword.request.dto';
import { ChangeUserLoginInfoDto } from './dto/ChangeUserLoginInfo.dto';
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

    async getVerifiedUser(accessToken: string) {
        const { email } = this.jwtService.verify(accessToken, {
            // TODO
            secret: 'Here gonna be some env var or etc',
        });

        const user = await this.findUserByEmail(email);

        if (!user) {
            throw new UnauthorizedException('User does not match');
        }

        return user;
    }

    async changeUserLoginInfo(accessToken: string, payload: ChangeUserLoginInfoDto) {
        if (Object.values(payload).every(value => !value)) {
            throw new BadRequestException('No changes provided');
        }

        if (payload.email) {
            const accAlreadyExists = Boolean(await this.findUserByEmail(payload.email));

            if (accAlreadyExists) {
                throw new ConflictException('There already exists an account linked to the provided email');
            }
        }

        try {
            const user = await this.getVerifiedUser(accessToken);

            return this.saveUser({ ...user, ...payload })
        } catch (error) {
            if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
        }
    }

    async changeUserPassword(accessToken: string, payload: ChangeUserPasswordRequestDto) {
        const user = await this.getVerifiedUser(accessToken);

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

    async deleteUser(accessToken: string) {
        try {
            const user = await this.getVerifiedUser(accessToken);

            this.usersRepository.remove(user);
        } catch (error) {
            if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
        }
    }
}
