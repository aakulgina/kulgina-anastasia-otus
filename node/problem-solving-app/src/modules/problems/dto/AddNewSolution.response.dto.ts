import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AddNewSolutionResponseDto {
    @IsString()
    @ApiProperty({ required: true })
    submissionId: string;
}
