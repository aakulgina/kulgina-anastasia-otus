import { IsEnum, IsString } from "class-validator";
import { ProgLanguage } from "../enum/ProgLanguage.enum";
import { ApiProperty } from "@nestjs/swagger";

export class AddNewSolutionRequestDto {
    @IsString()
    @ApiProperty({ required: true })
    userName: string;

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
