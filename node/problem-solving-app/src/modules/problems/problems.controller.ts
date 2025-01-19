import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ApiExtraModels, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProblemsListFilter } from './dto/ProblemsListFilter.dto';

@ApiTags('Problems')
@ApiExtraModels(ProblemsListFilter)
@Controller('problems')
export class ProblemsController {
    constructor (private readonly problemsService: ProblemsService) {}

    @Get()
    async getProblemsList(@Query() filters: ProblemsListFilter) {
        return this.problemsService.getProblemsList(filters);
    }

    @Get(':problemId')
    async getProblem(@Param('problemId') problemId: string) {
        return this.problemsService.getProblem(problemId);
    }

    @Get(':problemId/solutions')
    @ApiQuery({ name: 'userId', required: false })
    async getProblemSolutionsList(
        @Param('problemId') problemId: string,
        @Query('userId') userId?: string,
    ) {
        return this.problemsService.getProblemSolutionsList(problemId, userId);
    }

    @Post(':problemId/solutions')
    async addNewSolution(
        @Param('problemId') problemId: string,
        @Body() solutionPayload: unknown,
    ) {
        return this.problemsService.addNewSolution(problemId, solutionPayload);
    }

    @Get(':problemId/solutions/:solutionId')
    async getProblemSolution(
        @Param('problemId') problemId: string,
        @Param('solutionId') solutionId: string,
    ) {
        return this.problemsService.getProblemSolution(problemId, solutionId);
    }
}
