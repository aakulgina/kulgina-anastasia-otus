import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpRequestDto } from './dto/SignUp.request.dto';
import { LoginRequestDto } from './dto/Login.request.dto';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly settingsService: SettingsService,
        private readonly jwtService: JwtService,
    ) {}

    async register(payload: SignUpRequestDto) {
        const accAlreadyExists = Boolean(await this.usersService.findUserByEmail(payload.email));

        if (accAlreadyExists) {
            throw new ConflictException('There already exists an account linked to the provided email');
        }

        try {
            const passHash = await bcrypt.hash(payload.password, 10);
            
            const user = await this.usersService.saveUser({
                userName: payload.email.split('@')[0],
                email: payload.email,
                password: passHash,
            });

            await this.settingsService.createSettings(user.email);

            return user;
        } catch (error) {
            if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }
            
            throw new InternalServerErrorException(error);
        }
    }

    async login(payload: LoginRequestDto) {
        const targetUser = await this.usersService.findUserByEmail(payload.email);

        if (!targetUser || !(await bcrypt.compare(payload.password, targetUser.password))) {
            throw new UnauthorizedException();
        }

        try {    
            const user = {
                email: targetUser.email,
                sub: targetUser.id,
            }

            const access_token = this.jwtService.sign(user);
            
            return { access_token, userName: targetUser.userName }
        } catch (error) {
            if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
        }
    }
}
