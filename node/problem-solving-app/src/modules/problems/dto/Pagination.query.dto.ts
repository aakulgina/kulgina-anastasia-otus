import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class PaginationQueryDto {
    @IsNumber()
    @ApiPropertyOptional({ required: false })
    pageSize: number;

    @IsNumber()
    @ApiPropertyOptional({ required: false })
    pageNumber: number;
}
