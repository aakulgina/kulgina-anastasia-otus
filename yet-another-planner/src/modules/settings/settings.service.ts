import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from './settings.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class SettingsService {
    constructor(
        private readonly usersService: UsersService,

        @InjectRepository(Settings)
        private settingsRepository: Repository<Settings>,
    ) {}

    async createSettings(userEmail: string) {
        try {
            const userForPayload = await this.usersService.findUserByEmail(userEmail);

            if (!userForPayload) {
                throw new NotFoundException('Related user not found');
            }
    
            const settingsAlreadyExists = await this.settingsRepository.existsBy({ user: userForPayload });
    
            if (settingsAlreadyExists) {
                throw new ConflictException('Settings for the related user already exist');
            }
    
            this.settingsRepository.save({ user: userForPayload });
        } catch (error) {
            if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
        }
    }
}
