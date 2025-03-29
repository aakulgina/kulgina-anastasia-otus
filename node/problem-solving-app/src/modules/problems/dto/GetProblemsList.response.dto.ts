import { IsArray, IsNumber, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaginationResponseDto } from "./Pagination.response.dto";
import { ProblemListDto } from "./ProblemList.dto";

export class GetProblemsListResponseDto {
    @IsNumber()
    @ApiProperty({ required: true })
    total: number;

    @IsArray()
    @ApiProperty({
        required: true,
        isArray: true,
        type: ProblemListDto,
    })
    problems: Array<ProblemListDto>;

    @IsObject()
    @ApiProperty({
        required: true,
        type: PaginationResponseDto,
    })
    page: PaginationResponseDto;
}
