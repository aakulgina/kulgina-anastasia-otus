import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @ApiPropertyOptional({
        required: false,
        type: 'number',
    })
    pageSize?: string;

    @IsOptional()
    @ApiPropertyOptional({
        required: false,
        type: 'number',
    })
    pageNumber?: string;
}
