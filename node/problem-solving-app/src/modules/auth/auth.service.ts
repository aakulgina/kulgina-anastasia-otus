import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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
        if (!payload) {
            throw new BadRequestException();
        }

        if (payload.userName) {
            const userNameIsNotUnique = this.usersServie.findUserByUserName(payload.userName);

            if (userNameIsNotUnique) {
                throw new BadRequestException('User name already exists');
            }
        }

        try {
            const userName = payload.userName ?? payload.email.split('@')[0];
            const passHash = await bcrypt.hash(payload.password, 10);
            
            return this.usersServie.createNewUser({
                userName,
                email: payload.email,
                password: passHash,
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
        
    async login(payload: LoginRequestDto) {
        if (!payload) {
            throw new BadRequestException();
        }

        const targetUser = this.usersServie.findUserByEmail(payload.email);

        if (!targetUser || !(await bcrypt.compare(payload.password, targetUser.password))) {
            throw new UnauthorizedException();
        }

        try {    
            const user = {
                email: targetUser.email,
                sub: targetUser.id,
            }
            
            return {
                access_token: this.jwtService.sign(user),
            }
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
