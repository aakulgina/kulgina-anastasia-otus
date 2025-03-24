import {
	HttpException,
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
import { ProblemDto } from './dto/Problem.dto';
import { GetProblemSolutionsListResponseDto } from './dto/GetProblemSolutionsList.response.dto';
import { ProgLanguage } from './enum/ProgLanguage.enum';
import { SolutionDto } from './dto/Solution.dto';
import { AddNewSolutionResponseDto } from './dto/AddNewSolution.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProblemDifficulty } from './problem.difficulty.entity';
import { Topic } from './problem.topic.entity';
import { ProgrammingLanguage } from './problem.submission.lang.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProblemsService {
	constructor(
		private readonly usersService: UsersService,

		@InjectRepository(Problem)
		private problemsRepository: Repository<Problem>,

		@InjectRepository(Submission)
		private submissionsRepository: Repository<Submission>,

		@InjectRepository(ProblemDifficulty)
		private problemDifficultiesRepository: Repository<ProblemDifficulty>,

		@InjectRepository(Topic)
		private topicsRepository: Repository<Topic>,

		@InjectRepository(ProgrammingLanguage)
		private progLangsRepository: Repository<ProgrammingLanguage>,
	) {}

	async getProblemsList(
		page: { pageSize: number; pageNumber: number},
		filters?: ProblemsListFilter,
	): Promise<GetProblemsListResponseDto> {
		try {
			const query = this.problemsRepository.createQueryBuilder('problem');

			query
				.leftJoinAndSelect('problem.difficulty', 'problem_difficulty')
				.leftJoinAndSelect('problem.topics', 'topics');

			if (filters?.difficulty?.length) {
				query
					.andWhere("difficulty IN (:...diffValues)", { diffValues: filters.difficulty });
			}

			if (filters?.topics?.length) {
				query
					.andWhere("topic IN (:...topicValues)", { topicValues: filters.topics });
			}

			query
				.skip((page.pageNumber - 1) * page.pageSize)
				.take(page.pageSize);

			const [problems, amount] = await query.getManyAndCount();

			const totalPages = Math.ceil(amount / page.pageSize);

			if ((totalPages > 0) && (page.pageSize * page.pageNumber) > (page.pageSize * totalPages)) {
				throw new NotFoundException('Page not found');
			}

			const payload: GetProblemsListResponseDto = {
				total: amount,
				page: {
					pageNumber: page.pageNumber,
					pageSize: page.pageSize,
					totalPages: totalPages,
				},
				problems: problems.map(item => ({
					...item,
					difficulty: item.difficulty.difficulty,
					topics: item.topics.map(topic => topic.topic)
				})),
			};

			return payload;
		} catch (error) {
			if (error.message && error.status) {
				throw new HttpException(error.message, error.status);
			}
					
			throw new InternalServerErrorException(error);
		}
	}

	async getProblem(problemId: number): Promise<ProblemDto> {
		try {
			const query = this.problemsRepository.createQueryBuilder('problem');

			query
				.leftJoinAndSelect('problem.difficulty', 'problem_difficulty')
				.leftJoinAndSelect('problem.topics', 'topics')
				.andWhere('problem.id = :payloadId', { payloadId: problemId });

			const problem = await query.getOne();
			
			if (!problem) {
				throw new NotFoundException('Problem not found')
			}

			return {
				...problem,
				difficulty: problem.difficulty.difficulty,
				topics: problem.topics.map(topic => topic.topic),
			};
		} catch (error) {
			if (error.message && error.status) {
				throw new HttpException(error.message, error.status);
			}
			
			throw new InternalServerErrorException(error);
		}
	}

	async getProblemSolutionsList(
		problemId: number,
		page: { pageSize: number; pageNumber: number},
		userName?: string,
	): Promise<GetProblemSolutionsListResponseDto> {
		try {
			const problem = await this.problemsRepository.findOneBy({ id: problemId });

			if (!problem) {
				throw new NotFoundException('Related problem not found');
			}

			const query = this.submissionsRepository.createQueryBuilder('submission');

			query
				.leftJoinAndSelect('submission.problem', 'problem')
				.leftJoinAndSelect('submission.user', 'user')
				.leftJoinAndSelect('submission.lang', 'programming_language')
				.andWhere('problem.id = :payloadProblemId', { payloadProblemId: problemId });

			if (userName) {
				const user = await this.usersService.findUserByUserName(userName);

				if (!user) {
					throw new NotFoundException('Related user not found');
				}

				query
					.andWhere('"userName" = :payloadUserName', { payloadUserName: userName });
			}

			query
				.skip((page.pageNumber - 1) * page.pageSize)
				.take(page.pageSize);

			const [submissions, amount] = await query.getManyAndCount();

			const totalPages = Math.ceil(amount / page.pageSize);

			if ((totalPages > 0) && (page.pageSize * page.pageNumber) > (page.pageSize * totalPages)) {
				throw new NotFoundException('Page not found');
			}

			const payload: GetProblemSolutionsListResponseDto = {
				problemId: problemId,
				total: amount,
				page: {
					pageNumber: page.pageNumber,
					pageSize: page.pageSize,
					totalPages: totalPages,
				},
				solutions: submissions.map((item => ({
					id: item.id,
					created: item.created,
					userName: item.user.userName,
					lang: item.lang.progLang,
				})))
			};

			return payload;
		} catch (error) {
			if (error.message && error.status) {
				throw new HttpException(error.message, error.status);
			}
			
			throw new InternalServerErrorException(error);
		}
	}

	async getProblemSolution(problemId: number, solutionId: number): Promise<SolutionDto> {
		try {
			const problem = await this.problemsRepository.findOneBy({ id: problemId });

			if (!problem) {
				throw new NotFoundException('Related problem not found');
			}

			const query = this.submissionsRepository.createQueryBuilder('submission');

			query
				.leftJoinAndSelect('submission.problem', 'problem')
				.leftJoinAndSelect('submission.user', 'user')
				.leftJoinAndSelect('submission.lang', 'programming_language')
				.andWhere('submission.id = :payloadSubmissionId', { payloadSubmissionId: solutionId })
				.andWhere('problem.id = :payloadProblemId', { payloadProblemId: problemId });

			const submission = await query.getOne();

			if (!submission) {
				throw new NotFoundException('Submission not found');
			}

			const payload: SolutionDto = {
				id: submission.id,
				userName: submission.user.userName,
				correct: submission.correct,
				created: submission.created,
				lang: submission.lang.progLang,
				content: submission.content,
				problemId: submission.problem.id,
			};

			return payload;
		} catch (error) {
			if (error.message && error.status) {
				throw new HttpException(error.message, error.status);
			}
			
			throw new InternalServerErrorException(error);
		}
	}

	async addNewSolution(
		problemId: number,
		solution: AddNewSolutionRequestDto,
		accessToken: string,
	): Promise<AddNewSolutionResponseDto> {
		try {
			const problemForPayload = await this.problemsRepository.findOneBy({ id: problemId });

			if (!problemForPayload) {
				throw new NotFoundException('Related problem not found');
			}

			const langForPayload = await this.progLangsRepository.findOneBy({ progLang: solution.lang });

			if (!langForPayload) {
				throw new NotFoundException('Related programming language not found');
			}

			const userForPayload = await this.usersService.getVerifiedUser(accessToken, solution.userName);

			const newSubmission = await this.submissionsRepository.save({
				problem: problemForPayload,
				user: userForPayload,
				correct: Math.random() >= 0.5,
				lang: langForPayload,
				content: solution.content,
			});

			return { submissionId: newSubmission.id.toString() };
		} catch (error) {
			if (error.message && error.status) {
				throw new HttpException(error.message, error.status);
			}
			
			throw new InternalServerErrorException(error);
		}
	}
}
