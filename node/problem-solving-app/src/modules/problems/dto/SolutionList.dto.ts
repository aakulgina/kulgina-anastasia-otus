import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNumber, IsString } from "class-validator";
import { ProgLanguage } from "../enum/ProgLanguage.enum";

export class SolutionListDto {
    @IsNumber()
    @ApiProperty({ required: true })
    id: number;
    
    @IsDateString()
    @ApiProperty({ required: true })
    created: Date;

    @IsString()
    @ApiProperty({ required: true })
    userName: string;
    
    @IsEnum(ProgLanguage, { each: true })
    @ApiProperty({
        required: true,
        enum: ProgLanguage,
    })
    lang: ProgLanguage;
}
