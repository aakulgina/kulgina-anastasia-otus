import {
	Body,
	Controller,
	HttpCode,
	Post,
	Response,
	UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpRequestDto } from './dto/SignUp.request.dto';
import { LoginRequestDto } from './dto/Login.request.dto';
import { AuthService } from './auth.service';
import { SignUpResponseDto } from './dto/SignUp.response.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Auth')
@ApiExtraModels(SignUpRequestDto, SignUpResponseDto, LoginRequestDto)
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	@HttpCode(201)
	@ApiBody({
		description: 'Info neccessary to sign up',
		type: SignUpRequestDto,
		examples: {
			example1: {
				value: {
					userName: 'geek_cactus',
					email: 'abc@google.com',
					password: 'qwerty123',
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		description: 'New user created',
		type: SignUpResponseDto,
		example: {
			userId: '123',
		},
	})
	@ApiResponse({
		status: 400,
		description:
			"Problems with request body: something's missing or some validation errors occured",
	})
	@ApiResponse({
		status: 429,
		description: 'Too many requests error: Rate limit exceeded',
	})
	@ApiResponse({
		status: 500,
		description: 'Any internal error occured',
	})
	async signUp(
		@Body() payload: SignUpRequestDto,
	): Promise<SignUpResponseDto> {
		const user = await this.authService.register(payload);

		return { userName: `${user.userName}` };
	}

	@Throttle({
		default: { ttl: 60_000, limit: 10 },
	})
	@Post('login')
	@HttpCode(204)
	@ApiBody({
		description: 'Info needed to login',
		type: LoginRequestDto,
		examples: {
			example1: {
				value: {
					email: 'abc@google.com',
					password: 'qwerty123',
				},
			},
		},
	})
	@ApiResponse({
		status: 204,
		description: "Everything's ok",
	})
	@ApiResponse({
		status: 400,
		description:
			"Problems with request body: something's missing or some validation errors occured",
	})
	@ApiResponse({
		status: 401,
		description: 'No such user found or invalid credentials',
	})
	@ApiResponse({
		status: 429,
		description: 'Too many requests error: Rate limit exceeded',
	})
	@ApiResponse({
		status: 500,
		description: 'Any internal error occured',
	})
	async login(
		@Body() payload: LoginRequestDto,
		@Response({ passthrough: true }) response,
	) {
		try {
			const { access_token } = await this.authService.login(payload);

			response.cookie('accessToken', access_token, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
			});
		} catch (error) {
			throw error;
		}
	}
}
