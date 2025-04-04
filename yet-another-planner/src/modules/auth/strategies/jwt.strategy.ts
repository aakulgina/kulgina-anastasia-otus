import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

type JwtPayload = {
	sub: string;
	email: string;
};

@Injectable()
export class JWTAccessTokenStrategy extends PassportStrategy(JwtStrategy, 'jwt') {
	constructor(
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: (request) => request.cookies.accessToken,
			// TODO
			secretOrKey: 'Here gonna be some env var or etc',
		});
	}

	async validate(payload: JwtPayload) {
		const user = this.usersService.findUserByEmail(payload.email);

		if (!user) {
			throw new UnauthorizedException();
		} else {
			return payload;
		}
	}
}
