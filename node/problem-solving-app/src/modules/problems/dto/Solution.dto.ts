import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsString } from "class-validator";
import { ProgLanguage } from "../enum/ProgLanguage.enum";

export class SolutionDto {
    @IsNumber()
    @ApiProperty({ required: true })
    id: number;

    @IsString()
    @ApiProperty({ required: true })
    userName: string;
    
    @IsBoolean()
    @ApiProperty({ required: true })
    correct: boolean;
    
    @IsDateString()
    @ApiProperty({ required: true })
    created: string;
    
    @IsEnum(ProgLanguage, { each: true })
    @ApiProperty({
        required: true,
        enum: ProgLanguage,
    })
    lang: ProgLanguage;
    
    @IsString()
    @ApiProperty({ required: true })
    content: string;
}
