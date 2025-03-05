import { Module } from '@nestjs/common';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './problem.entity';
import { Submission } from './problem.submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Problem, Submission])],
  controllers: [ProblemsController],
  providers: [ProblemsService]
})
export class ProblemsModule {}
