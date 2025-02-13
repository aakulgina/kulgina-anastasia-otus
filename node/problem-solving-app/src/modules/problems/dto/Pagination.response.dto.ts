import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class PaginationResponseDto {
    @IsNumber()
    @ApiProperty({ required: true })
    pageSize: number;

    @IsNumber()
    @ApiProperty({ required: true })
    pageNumber: number;

    @IsNumber()
    @ApiProperty({ required: true })
    totalPages: number;
}
