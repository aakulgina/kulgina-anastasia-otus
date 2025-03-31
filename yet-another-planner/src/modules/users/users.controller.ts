import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Patch,
	Request,
	Response,
	UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
	ApiBody, ApiCookieAuth, ApiExtraModels,
	ApiResponse, ApiTags, ApiBadRequestResponse,
    ApiUnauthorizedResponse, ApiNotFoundResponse,
    ApiNoContentResponse,
	ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ChangeUserPasswordRequestDto } from './dto/ChangeUserPassword.request.dto';
import { ChangeUserLoginInfoDto } from './dto/ChangeUserLoginInfo.dto';
import { CreateUserDto } from './dto/CreateUser.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Users')
@ApiExtraModels(
	ChangeUserPasswordRequestDto,
	ChangeUserLoginInfoDto,
	CreateUserDto,
)
@UseGuards(ThrottlerGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Patch('currentUser')
    @HttpCode(200)
	@ApiCookieAuth()
    @ApiBody({
		description:
			'Although all the fields are optional, at least one have to be filled',
		type: ChangeUserLoginInfoDto,
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
		type: ChangeUserLoginInfoDto,
		example: {
			userName: 'geek_cactus',
			email: 'abc@google.com',
		},
	})
    @ApiBadRequestResponse({ description: 'Bad request or failed validation' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized, unable to complete action' })
	@ApiConflictResponse({ description: 'There already exists another acc with provided email' })
    async changeUserLoginInfo(
		@Request() request,
		@Body() payload: ChangeUserLoginInfoDto,
	): Promise<ChangeUserLoginInfoDto> {
        try {
            const user = await this.usersService.changeUserLoginInfo(request.cookies['accessToken'], payload);

            return user;
        } catch (error) {
			if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
		}
    }

    @UseGuards(AuthGuard)
    @Patch('currentUser/password')
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
    @ApiNoContentResponse({ description: 'Password changed' })
    @ApiBadRequestResponse({ description: 'Bad request or failed validation' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized, unable to complete action' })
    async changeUserPassword(
		@Request() request,
		@Body() payload: ChangeUserPasswordRequestDto,
	) {
        try {
			await this.usersService
				.changeUserPassword(request.cookies['accessToken'], payload);
		} catch (error) {
			if (error.message && error.status) {
                throw new HttpException(error.message, error.status);
            }

            throw new InternalServerErrorException(error);
		}
    }

    @UseGuards(AuthGuard)
	@Delete('currentUser')
	@HttpCode(204)
	@ApiCookieAuth()
    @ApiNoContentResponse({ description: 'Account deleted' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized, unable to complete action' })
    async deleteUserProfile(
		@Param('userName') userName: string,
		@Request() request,
		@Response({ passthrough: true }) response,
	) {
        try {
            await this.usersService.deleteUser(request.cookies['accessToken']);

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
