import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	InternalServerErrorException,
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
import { AuthGuard } from './auth.guard';
import { LoginResponseDto } from './dto/Login.response.dto';

@ApiTags('Auth')
@ApiExtraModels(SignUpRequestDto, SignUpResponseDto, LoginRequestDto, LoginResponseDto)
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
		const { userName } = await this.authService.register(payload);

		return { userName };
	}

	@Throttle({
		default: { ttl: 60_000, limit: 10 },
	})
	@Post('login')
	@HttpCode(200)
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
		status: 200,
		description: "Everything's ok",
		type: LoginResponseDto,
		example: {
			userName: 'geek_cactus',
		},
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
	): Promise<LoginResponseDto> {
		try {
			const { access_token, userName } = await this.authService.login(payload);

			response.cookie('accessToken', access_token, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
			});

			return { userName }
		} catch (error) {
			if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
		}
	}

	@UseGuards(AuthGuard)
	@Get('logout')
	@HttpCode(204)
	@ApiResponse({
		status: 204,
		description: "Everything's ok",
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
	async logout(
		@Response({ passthrough: true }) response,
	) {
		try {
			response.cookie('accessToken', null, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() - 3000),
			});
		} catch (error) {
			if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
		}
	}
}
