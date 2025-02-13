import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ChangeUserProfileRequestDto {
    @IsString()
    @ApiPropertyOptional()
    userName?: string;

    @IsString()
    @ApiPropertyOptional()
    email?: string;
}
