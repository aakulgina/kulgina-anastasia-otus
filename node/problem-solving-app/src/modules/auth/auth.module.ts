import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWTAccessTokenStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		UsersModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			global: true,
			// TODO
			secret: 'Here gonna be some env var or etc',
			signOptions: { expiresIn: '1d' },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JWTAccessTokenStrategy]
})

export class AuthModule { }
