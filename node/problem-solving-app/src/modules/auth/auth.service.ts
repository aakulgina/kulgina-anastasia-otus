import { BadRequestException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpRequestDto } from './dto/SignUp.request.dto';
import { LoginRequestDto } from './dto/Login.request.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersServie: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(payload: SignUpRequestDto) {
        if (payload.userName) {
            const userNameAlreadyExists = Boolean(await this.usersServie.findUserByUserName(payload.userName));

            if (userNameAlreadyExists) {
                throw new BadRequestException('User name already exists');
            }
        }

        try {
            const userName = payload.userName ?? payload.email;
            const passHash = await bcrypt.hash(payload.password, 10);
            
            return this.usersServie.saveUser({
                userName,
                email: payload.email,
                password: passHash,
            });
        } catch (error) {
            if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }
            
            throw new InternalServerErrorException(error);
        }
    }

    async login(payload: LoginRequestDto) {
        const targetUser = await this.usersServie.findUserByEmail(payload.email);

        if (!targetUser || !(await bcrypt.compare(payload.password, targetUser.password))) {
            throw new UnauthorizedException();
        }

        try {    
            const user = {
                email: targetUser.email,
                sub: targetUser.id,
            }

            const access_token = this.jwtService.sign(user);
            await this.usersServie.updateUserLoginInfo(access_token, targetUser.userName)
            
            return { access_token, userName: targetUser.userName }
        } catch (error) {
            if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
        }
    }
}
