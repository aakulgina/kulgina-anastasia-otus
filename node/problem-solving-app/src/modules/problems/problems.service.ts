import { Injectable } from '@nestjs/common';
import { ProblemsListFilter } from './dto/ProblemsListFilter.dto';

@Injectable()
export class ProblemsService {
    getProblemsList(filters?: ProblemsListFilter): string {
        return `Hello getProblemsList, I got ${Object.keys(filters ?? {}).length ? 'some' : 'no'} filters`;
    }

    getProblem(problemId: string) {
        return `Hello getProblem, I gonna find you the problem with the following id: ${problemId}`;
    }

    getProblemSolutionsList(problemId: string, userId?: string) {
        return `Hello getProblemSolutionsList, I gonna list you all the solutions for the problem with the following id: ${problemId}` + (userId ? `. I gonna do it for the user with id ${userId}` : '');
    }

    getProblemSolution(problemId: string, solutionId: string) {
        return `Hello getProblemSolution, I gonna give you the solution with id ${solutionId} for the problem with id ${problemId}`;
    }

    addNewSolution(problemId: string, solution: unknown) {
        return `Hello addNewSolution, I gonna add new solution to the problem with id ${[problemId]}`;
    }
}
