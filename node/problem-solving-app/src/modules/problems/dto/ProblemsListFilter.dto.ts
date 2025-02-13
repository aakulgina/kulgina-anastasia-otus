import { IsOptional, IsArray, ArrayNotEmpty, IsEnum } from 'class-validator';
import { ProblemDifficulty } from '../enum/ProblemDifficulty.enum';
import { ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { ProblemTopic } from '../enum/ProblemTopic.enum';
import { Transform } from 'class-transformer';

export class ProblemsListFilter {
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(ProblemDifficulty, { each: true })
    @ApiPropertyOptional({
        required: false,
        isArray: true,
        enum: ProblemDifficulty,
        description: 'Problems of which difficulty(-ies) to show in the list',
    })
    difficulty?: Array<ProblemDifficulty>;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(ProblemTopic, { each: true })
    @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
    @ApiPropertyOptional({
        required: false,
        isArray: true,
        enum: ProblemTopic,
        description: 'Problems of which topic(-s) to show in the list'
    })
    topics?: Array<ProblemTopic>;
}
