import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNumber } from "class-validator";
import { ProgLanguage } from "../enum/ProgLanguage.enum";

export class SolutionListDto {
    @IsNumber()
    @ApiProperty({ required: true })
    id: number;
    
    @IsDateString()
    @ApiProperty({ required: true })
    created: string;
    
    @IsEnum(ProgLanguage, { each: true })
    @ApiProperty({
        required: true,
        enum: ProgLanguage,
    })
    lang: ProgLanguage;
}
