import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
	ApiBody,
	ApiCookieAuth,
	ApiExtraModels,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ChangeUserPasswordRequestDto } from './dto/ChangeUserPassword.request.dto';
import { ChangeUserProfileRequestDto } from './dto/ChangeUserProfile.request.dto';
import { CreateUserDto } from './dto/CreateUser.dto';
import { GetUserProfileResponseDto } from './dto/GetUserProfile.response.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Users')
@ApiExtraModels(
	ChangeUserPasswordRequestDto,
	ChangeUserProfileRequestDto,
	CreateUserDto,
	GetUserProfileResponseDto,
)
@UseGuards(ThrottlerGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AuthGuard)
	@Get(':userId')
	@HttpCode(200)
	@ApiCookieAuth()
	@ApiResponse({
		status: 200,
		description: "Everything's ok",
		type: GetUserProfileResponseDto,
		example: {
			id: '123',
			userName: 'geek_cactus',
			email: 'abc@google.com',
			lastSeen: new Date().toISOString(),
		},
	})
	@ApiResponse({
		status: 401,
		description: 'Only authorized users are able to watch profiles',
	})
	@ApiResponse({
		status: 404,
		description: 'User not found',
	})
	@ApiResponse({
		status: 429,
		description: 'Too many requests error: Rate limit exceeded',
	})
	@ApiResponse({
		status: 500,
		description: 'Any internal error occured',
	})
	async getUserProfile(
		@Param('userId') userId: string,
	): Promise<GetUserProfileResponseDto> {
		const { id, userName, email, lastSeen } = this.usersService.getUserById(
			Number(userId),
		);

		return {
			id: `${id}`,
			userName,
			email,
			lastSeen,
		};
	}

	@UseGuards(AuthGuard)
	@Patch(':userId')
	@HttpCode(200)
	@ApiCookieAuth()
	@ApiBody({
		description:
			'Although all the fields are optional, at least one have to be filled',
		type: ChangeUserProfileRequestDto,
		examples: {
			example1: {
				value: {
					userName: 'geek_cactussss',
					email: 'def@google.com',
				},
			},
		},
	})
	@ApiResponse({
		status: 200,
		description:
			'Profile data changed. Response body contains updated profile info',
		type: GetUserProfileResponseDto,
		example: {
			id: '123',
			userName: 'geek_cactus',
			email: 'abc@google.com',
			lastSeen: new Date().toISOString(),
		},
	})
	@ApiResponse({
		status: 400,
		description:
			"Problems with request body: something's missing or some validation errors occured",
	})
	@ApiResponse({
		status: 401,
		description:
			'Only authorized users are able to change their own profiles',
	})
	@ApiResponse({
		status: 429,
		description: 'Too many requests error: Rate limit exceeded',
	})
	@ApiResponse({
		status: 500,
		description: 'Any internal error occured',
	})
	async changeUserProfileData(
		@Param('userId') userId: string,
		@Body() payload: ChangeUserProfileRequestDto,
	): Promise<GetUserProfileResponseDto> {
		const { id, userName, email, lastSeen } =
			this.usersService.changeUserProfile(Number(userId), payload);

		return {
			id: `${id}`,
			userName,
			email,
			lastSeen,
		};
	}

	@UseGuards(AuthGuard)
	@Patch(':userId/password')
	@HttpCode(204)
	@ApiCookieAuth()
	@ApiBody({
		description: 'Info neccessary to set new password',
		type: ChangeUserPasswordRequestDto,
		examples: {
			example1: {
				value: {
					currentPassword: 'qwerty123',
					newPassword: 'qwerty321',
				},
			},
		},
	})
	@ApiResponse({
		status: 204,
		description: 'Password changed',
	})
	@ApiResponse({
		status: 400,
		description:
			"Problems with request body: something's missing or some validation errors occured",
	})
	@ApiResponse({
		status: 401,
		description:
			'Only authorized users are able to change their own profiles',
	})
	@ApiResponse({
		status: 429,
		description: 'Too many requests error: Rate limit exceeded',
	})
	@ApiResponse({
		status: 500,
		description: 'Any internal error occured',
	})
	async changeUserPassword(
		@Param('userId') userId: string,
		@Body() payload: ChangeUserPasswordRequestDto,
	) {
		this.usersService.changeUserPassword(Number(userId), payload);
	}

	@UseGuards(AuthGuard)
	@Delete(':userId')
	@HttpCode(204)
	@ApiCookieAuth()
	@ApiResponse({
		status: 204,
		description: 'User successfully deleted',
	})
	@ApiResponse({
		status: 401,
		description:
			'Only the authorized users themselves are able to delete their own profiles',
	})
	@ApiResponse({
		status: 429,
		description: 'Too many requests error: Rate limit exceeded',
	})
	@ApiResponse({
		status: 500,
		description: 'Any internal error occured',
	})
	async deleteUserProfile(@Param('userId') userId: string) {
		this.usersService.deleteUserById(Number(userId));
	}
}
