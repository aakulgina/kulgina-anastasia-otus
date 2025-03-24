import { IsEnum, IsNumber, IsString } from "class-validator";
import { ProblemDifficulty } from "../enum/ProblemDifficulty.enum";
import { ProblemTopic } from "../enum/ProblemTopic.enum";
import { ApiProperty } from "@nestjs/swagger";

export class ProblemListDto {
    @IsNumber()
    @ApiProperty({ required: true })
    id: number;

    @IsString()
    @ApiProperty({ required: true })
    title: string;

    @IsString()
    @ApiProperty({ required: true })
    description: string;

    @IsEnum(ProblemDifficulty, { each: true })
    @ApiProperty({
        required: true,
        enum: ProblemDifficulty,
    })
    difficulty: ProblemDifficulty;
    
    @IsEnum(ProblemTopic, { each: true })
    @ApiProperty({
        required: true,
        enum: ProblemTopic,
    })
    topics: Array<ProblemTopic>;
}