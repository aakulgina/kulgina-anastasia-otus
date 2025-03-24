import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsObject, IsString } from "class-validator";
import { PaginationResponseDto } from "./Pagination.response.dto";
import { SolutionListDto } from "./SolutionList.dto";

export class GetProblemSolutionsListResponseDto {
    @IsString()
    @ApiProperty({ required: true })
    problemId: number;

    @IsNumber()
    @ApiProperty({ required: true })
    total: number;

    @IsArray()
    @ApiProperty({
        required: true,
        isArray: true,
        type: SolutionListDto,
    })
    solutions: Array<SolutionListDto>;

    @IsObject()
    @ApiProperty({
        required: true,
        type: PaginationResponseDto,
    })
    page: PaginationResponseDto;
}
