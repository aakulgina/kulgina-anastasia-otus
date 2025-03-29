import { Module } from '@nestjs/common';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './problem.entity';
import { Submission } from './problem.submission.entity';
import { ProblemDifficulty } from './problem.difficulty.entity';
import { Topic } from './problem.topic.entity';
import { ProgrammingLanguage } from './problem.submission.lang.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Problem, Submission, ProblemDifficulty, Topic, ProgrammingLanguage]),
  ],
  controllers: [ProblemsController],
  providers: [ProblemsService]
})
export class ProblemsModule {}
