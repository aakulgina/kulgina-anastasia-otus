import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { ProblemsListFilter } from './dto/ProblemsListFilter.dto';
import { AddNewSolutionRequestDto } from './dto/AddNewSolution.request.dto';
import { Problem } from './problem.entity';
import { PaginationQueryDto } from './dto/Pagination.query.dto';
import { Submission } from './problem.submission.entity';
import { GetProblemsListResponseDto } from './dto/GetProblemsList.response.dto';
import { ProblemDifficulty } from './enum/ProblemDifficulty.enum';
import { ProblemTopic } from './enum/ProblemTopic.enum';
import { ProblemDto } from './dto/Problem.dto';
import { GetProblemSolutionsListResponseDto } from './dto/GetProblemSolutionsList.response.dto';
import { ProgLanguage } from './enum/ProgLanguage.enum';
import { SolutionDto } from './dto/Solution.dto';
import { AddNewSolutionResponseDto } from './dto/AddNewSolution.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProblemsService {
	constructor(
		@InjectRepository(Problem)
		private problemsRepository: Repository<Problem>,

		@InjectRepository(Submission)
		private submissionsRepository: Repository<Submission>,
	) {}

	// TODO Place db connection here later
	private problems: Array<any> = [];
	private solutions: Array<any> = [];

	getProblemsList(
		filters?: ProblemsListFilter,
		page?: PaginationQueryDto,
	): GetProblemsListResponseDto {
		try {
			console.log(
				`Hello getProblemsList, I got ${Object.keys(filters ?? {}).length ? 'some' : 'no'} filters and ${Object.keys(page ?? {}).length ? 'some' : 'no'} info about pagination`,
			);

			const payload: GetProblemsListResponseDto = {
				total: 1,
				page: {
					pageNumber: 1,
					pageSize: 10,
					totalPages: 1,
				},
				problems: [
					{
						id: 1,
						title: 'Hello world!',
						difficulty: ProblemDifficulty.EASY,
						topics: [ProblemTopic.STRING],
					},
				],
			};

			return payload;
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	getProblem(problemId: string): ProblemDto {
		if (!problemId) {
			throw new NotFoundException();
		}

		try {
			console.log(
				`Hello getProblem, I gonna find you the problem with the following id: ${problemId}`,
			);

			return {
				id: 1,
				title: 'Hello world!',
				description: 'Print "Hello world!"',
				difficulty: ProblemDifficulty.EASY,
				topics: [ProblemTopic.STRING],
			};
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	getProblemSolutionsList(
		problemId: string,
		userId?: string,
		page?: PaginationQueryDto,
	): GetProblemSolutionsListResponseDto {
		if (!problemId) {
			throw new NotFoundException();
		}

		try {
			console.log(
				`Hello getProblemSolutionsList, I gonna list you all the solutions for the problem with the following id: ${problemId}` +
					(userId
						? `. I gonna do it for the user with id ${userId}`
						: ''),
			);
			console.log(page);

			const payload: GetProblemSolutionsListResponseDto = {
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
						created: new Date().toISOString(),
						lang: ProgLanguage.TYPESCRIPT,
					},
				],
			};

			return payload;
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	getProblemSolution(problemId: string, solutionId: string): SolutionDto {
		if (!problemId || !solutionId) {
			throw new NotFoundException();
		}

		try {
			console.log(
				`Hello getProblemSolution, I gonna give you the solution with id ${solutionId} for the problem with id ${problemId}`,
			);

			const payload: SolutionDto = {
				id: 1,
				userName: 'geek_cactus',
				correct: false,
				created: new Date().toISOString(),
				lang: ProgLanguage.TYPESCRIPT,
				content: 'Your solution here',
			};

			return payload;
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	addNewSolution(
		problemId: string,
		solution: AddNewSolutionRequestDto,
	): AddNewSolutionResponseDto {
		if (!problemId) {
			throw new NotFoundException();
		}

		if (!solution) {
			throw new BadRequestException();
		}

		try {
			console.log(
				`Hello addNewSolution, I gonna add new solution to the problem with id ${[problemId]}`,
			);

			const payload = { submissionId: '444' };

			return payload;
		} catch (_error) {
			throw new InternalServerErrorException();
		}
	}
}
