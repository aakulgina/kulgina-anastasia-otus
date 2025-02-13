import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ApiBody, ApiCookieAuth, ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Problems')
@ApiExtraModels(
    ProblemsListFilter,
    PaginationQueryDto, PaginationResponseDto,
    GetProblemsListResponseDto, ProblemListDto, ProblemDto,
    GetProblemSolutionsListResponseDto, SolutionListDto, SolutionDto,
    AddNewSolutionRequestDto, AddNewSolutionResponseDto,
)
@Controller('problems')
export class ProblemsController {
    constructor (private readonly problemsService: ProblemsService) {}

    @Get()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Everything\'s ok',
        type: GetProblemsListResponseDto,
        example: {
            total: 1,
            problems: [
                {
                    id: 1,
                    title: 'Hello world!',
                    difficulty: ProblemDifficulty.EASY,
                    topics: [ProblemTopic.STRING],
                },
            ],
            page: {
                pageSize: 10,
                pageNumber: 1,
                totalPages: 1,
            },
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Any internal error occured',
    })
    async getProblemsList(
        @Query() filters: ProblemsListFilter,
        @Query() page: PaginationQueryDto,
    ): Promise<GetProblemsListResponseDto> {
        return this.problemsService.getProblemsList(filters, page);
    }

    @Get(':problemId')
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Everything\'s ok',
        type: ProblemDto,
        example: {
            id: 1,
            title: 'Hello world!',
            description: 'Print "Hello world!"',
            difficulty: ProblemDifficulty.EASY,
            topics: [ProblemTopic.STRING],
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Problem not found',
    })
    @ApiResponse({
        status: 500,
        description: 'Any internal error occured',
    })
    async getProblem(
        @Param('problemId') problemId: string,
    ): Promise<ProblemDto> {
        return this.problemsService.getProblem(problemId);
    }
    
    @Get(':problemId/solutions')
    @HttpCode(200)
    @ApiQuery({ name: 'userId', required: false })
    @ApiResponse({
        status: 200,
        description: 'Everything\'s ok',
        type: GetProblemSolutionsListResponseDto,
        example: {
            problemId: '1',
            total: 1,
            page: {
                pageSize: 10,
                pageNumber: 1,
                totalPages: 1,
            },
            solutions: [
                {
                    id: 1,
                    created: (new Date()).toISOString(),
                    lang: ProgLanguage.TYPESCRIPT,
                }
            ],
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Problem not found',
    })
    @ApiResponse({
        status: 500,
        description: 'Any internal error occured',
    })
    async getProblemSolutionsList(
        @Param('problemId') problemId: string,
        @Query() page: PaginationQueryDto,
        @Query('userId') userId?: string,
    ): Promise<GetProblemSolutionsListResponseDto> {
        return this.problemsService.getProblemSolutionsList(problemId, userId, page);
    }
    
    @UseGuards(AuthGuard)
    @Post(':problemId/solutions')
    @HttpCode(201)
    @ApiCookieAuth()
    @ApiBody({
        description: 'Info needed to post a new solution for a specified problem',
        type: AddNewSolutionRequestDto,
        examples: {
            example1: {
                value: {
                    userId: '123',
                    lang: ProgLanguage.TYPESCRIPT,
                    content: 'Your solution here',
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'New solution created',
        type: AddNewSolutionResponseDto,
        example: {
            submissionId: '123',
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Problems with request body: something\'s missing or some validation errors occured',
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
        status: 500,
        description: 'Any internal error occured',
    })
    async addNewSolution(
        @Param('problemId') problemId: string,
        @Body() solutionPayload: AddNewSolutionRequestDto,
    ): Promise<AddNewSolutionResponseDto> {
        return this.problemsService.addNewSolution(problemId, solutionPayload);
    }
    
    @Get(':problemId/solutions/:solutionId')
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Everything\'s ok',
        type: SolutionDto,
        example: {
            id: 1,
            userName: 'geek_cactus',
            correct: false,
            created: (new Date()).toISOString(),
            lang: ProgLanguage.TYPESCRIPT,
            content: 'Your solution here',
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Problem or solution not found',
    })
    @ApiResponse({
        status: 500,
        description: 'Any internal error occured',
    })
    async getProblemSolution(
        @Param('problemId') problemId: string,
        @Param('solutionId') solutionId: string,
    ): Promise<SolutionDto> {
        return this.problemsService.getProblemSolution(problemId, solutionId);
    }
}
