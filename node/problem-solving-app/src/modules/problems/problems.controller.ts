import {
	BadRequestException,
	Body,
	Controller,
	DefaultValuePipe,
	Get,
	HttpCode,
	HttpException,
	InternalServerErrorException,
	Param,
	ParseArrayPipe,
	ParseIntPipe,
	Post,
	Query,
	Request,
	UseGuards,
} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import {
	ApiBody,
	ApiCookieAuth,
	ApiExtraModels,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ProblemsListFilter } from './dto/ProblemsListFilter.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AddNewSolutionRequestDto } from './dto/AddNewSolution.request.dto';
import { ProgLanguage } from './enum/ProgLanguage.enum';
import { AddNewSolutionResponseDto } from './dto/AddNewSolution.response.dto';
import { GetProblemsListResponseDto } from './dto/GetProblemsList.response.dto';
import { PaginationQueryDto } from './dto/Pagination.query.dto';
import { PaginationResponseDto } from './dto/Pagination.response.dto';
import { GetProblemSolutionsListResponseDto } from './dto/GetProblemSolutionsList.response.dto';
import { ProblemListDto } from './dto/ProblemList.dto';
import { ProblemDifficulty } from './enum/ProblemDifficulty.enum';
import { ProblemTopic } from './enum/ProblemTopic.enum';
import { ProblemDto } from './dto/Problem.dto';
import { SolutionListDto } from './dto/SolutionList.dto';
import { SolutionDto } from './dto/Solution.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { min } from 'class-validator';

@ApiTags('Problems')
@ApiExtraModels(
	ProblemsListFilter,
	PaginationQueryDto,
	PaginationResponseDto,
	GetProblemsListResponseDto,
	ProblemListDto,
	ProblemDto,
	GetProblemSolutionsListResponseDto,
	SolutionListDto,
	SolutionDto,
	AddNewSolutionRequestDto,
	AddNewSolutionResponseDto,
)
@UseGuards(ThrottlerGuard)
@Controller('problems')
export class ProblemsController {
	constructor(private readonly problemsService: ProblemsService) {}

	@Get()
	@HttpCode(200)
	@ApiResponse({
		status: 200,
		description: "Everything's ok",
		type: GetProblemsListResponseDto,
		example: {
			total: 1,
			problems: [
				{
					id: 1,
					title: 'Hello world!',
					description: 'Hello world!',
					difficulty: ProblemDifficulty.EASY,
					topics: [ProblemTopic.STRING],
				},
			],
			page: {
				pageSize: 10,
				pageNumber: 1,
				totalPages: 1,
			},
		},
	})
	@ApiResponse({
		status: 400,
		description: 'Problems with query params: one or more values do not fit corresponding enums',
	})
	@ApiResponse({
		status: 429,
		description: 'Too many requests error: Rate limit exceeded',
	})
	@ApiResponse({
		status: 500,
		description: 'Any internal error occured',
	})
	async getProblemsList(
		@Query() { difficulty, topics }: ProblemsListFilter,
		@Query() { pageNumber, pageSize }: PaginationQueryDto,
	): Promise<GetProblemsListResponseDto> {
		try {
			const arrayParser = new ParseArrayPipe({ optional: true });
			const numberParser = new ParseIntPipe({ optional: true });

			const parsedPageSize = await new DefaultValuePipe(10).transform(
				await numberParser.transform(pageSize, { type: 'query' })
			);
			const parsedPageNumber = await new DefaultValuePipe(1).transform(
				await numberParser.transform(pageNumber, { type: 'query' })
			);

			if (!(min(parsedPageNumber, 1) && min(parsedPageSize, 1))) {
				throw new BadRequestException('Validation failed (min value of 1 expected)')
			}
 
			const problemsList = await this.problemsService.getProblemsList(
				{ pageNumber: parsedPageNumber, pageSize: parsedPageSize },
				{
					difficulty: await arrayParser.transform(difficulty, { type: 'query' }),
					topics: await arrayParser.transform(topics, { type: 'query' }),
				}
			);

			return problemsList;
		} catch (error) {
			if (error.message && error.status) {
				throw new HttpException(error.message, error.status);
			}
			
			throw new InternalServerErrorException(error);
		}
	}

	@Get(':problemId')
	@HttpCode(200)
	@ApiResponse({
		status: 200,
		description: "Everything's ok",
		type: ProblemDto,
		example: {
			id: 1,
			title: 'Hello world!',
			description: 'Print "Hello world!"',
			difficulty: ProblemDifficulty.EASY,
			topics: [ProblemTopic.STRING],
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Problem not found',
	})
	@ApiResponse({
		status: 429,
		description: 'Too many requests error: Rate limit exceeded',
	})
	@ApiResponse({
		status: 500,
		description: 'Any internal error occured',
	})
	async getProblem(
		@Param('problemId', ParseIntPipe) problemId: number,
	): Promise<ProblemDto> {
		try {
			const problem = await this.problemsService.getProblem(problemId);

			return problem;
		} catch (error) {
			if (error.message && error.status) {
				throw new HttpException(error.message, error.status);
			}
			
			throw new InternalServerErrorException(error);
		}
	}

	@Get(':problemId/solutions')
	@HttpCode(200)
	@ApiQuery({ name: 'userName', required: false })
	@ApiResponse({
		status: 200,
		description: "Everything's ok",
		type: GetProblemSolutionsListResponseDto,
		example: {
			problemId: 1,
			total: 1,
			page: {
				pageSize: 10,
				pageNumber: 1,
				totalPages: 1,
			},
			solutions: [
				{
					id: 1,
					created: new Date().toISOString(),
					lang: ProgLanguage.TYPESCRIPT,
					userName: 'geek_cactus',
				},
			],
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Problem not found',
	})
	@ApiResponse({
		status: 429,
		description: 'Too many requests error: Rate limit exceeded',
	})
	@ApiResponse({
		status: 500,
		description: 'Any internal error occured',
	})
	async getProblemSolutionsList(
		@Param('problemId', ParseIntPipe) problemId: number,
		@Query() { pageNumber, pageSize }: PaginationQueryDto,
		@Query('userName') userName?: string,
	): Promise<GetProblemSolutionsListResponseDto> {
		try {
			const numberParser = new ParseIntPipe({ optional: true });

			const parsedPageSize = await new DefaultValuePipe(10).transform(
				await numberParser.transform(pageSize, { type: 'query' })
			);
			const parsedPageNumber = await new DefaultValuePipe(1).transform(
				await numberParser.transform(pageNumber, { type: 'query' })
			);

			if (!(min(parsedPageNumber, 1) && min(parsedPageSize, 1))) {
				throw new BadRequestException('Validation failed (min value of 1 expected)')
			}

			const solutionsList = await this.problemsService.getProblemSolutionsList(
				problemId,
				{ pageNumber: parsedPageNumber, pageSize: parsedPageSize },
				userName,
			);

			return solutionsList;
		}  catch (error) {
			if (error.message && error.status) {
				throw new HttpException(error.message, error.status);
			}
			
			throw new InternalServerErrorException(error);
		}
	}

	@UseGuards(AuthGuard)
	@Post(':problemId/solutions')
	@HttpCode(201)
	@ApiCookieAuth()
	@ApiBody({
		description:
			'Info needed to post a new solution for a specified problem',
		type: AddNewSolutionRequestDto,
		examples: {
			example1: {
				value: {
					userName: 'geek_cactus',
					lang: ProgLanguage.TYPESCRIPT,
					content: 'Your solution here',
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		description: 'New solution created',
		type: AddNewSolutionResponseDto,
		example: {
			submissionId: '123',
		},
	})
	@ApiResponse({
		status: 400,
		description:
			"Problems with request body: something's missing or some validation errors occured",
	})
	@ApiResponse({
		status: 401,
		description: 'Only authorized users are able to create new solutions',
	})
	@ApiResponse({
		status: 404,
		description: 'Problem not found',
	})
	@ApiResponse({
		status: 429,
		description: 'Too many requests error: Rate limit exceeded',
	})
	@ApiResponse({
		status: 500,
		description: 'Any internal error occured',
	})
	async addNewSolution(
		@Param('problemId', ParseIntPipe) problemId: number,
		@Body() solutionPayload: AddNewSolutionRequestDto,
		@Request() request,
	): Promise<AddNewSolutionResponseDto> {
		try {
			const submission = this.problemsService.addNewSolution(problemId, solutionPayload, request.cookies['accessToken']);

			return submission;
		}  catch (error) {
			if (error.message && error.status) {
				throw new HttpException(error.message, error.status);
			}
			
			throw new InternalServerErrorException(error);
		}
	}

	@Get(':problemId/solutions/:solutionId')
	@HttpCode(200)
	@ApiResponse({
		status: 200,
		description: "Everything's ok",
		type: SolutionDto,
		example: {
			id: 1,
			userName: 'geek_cactus',
			correct: false,
			created: new Date().toISOString(),
			lang: ProgLanguage.TYPESCRIPT,
			content: 'Your solution here',
			problemId: 1,
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Problem or solution not found',
	})
	@ApiResponse({
		status: 429,
		description: 'Too many requests error: Rate limit exceeded',
	})
	@ApiResponse({
		status: 500,
		description: 'Any internal error occured',
	})
	async getProblemSolution(
		@Param('problemId', ParseIntPipe) problemId: number,
		@Param('solutionId', ParseIntPipe) solutionId: number,
	): Promise<SolutionDto> {
		try {
			const submission = await this.problemsService.getProblemSolution(problemId, solutionId);

			return submission;
		}  catch (error) {
			if (error.message && error.status) {
				throw new HttpException(error.message, error.status);
			}
			
			throw new InternalServerErrorException(error);
		}
	}
}
