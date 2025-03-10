import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class ChangeUserProfileRequestDto {
    @IsOptional()
    @IsString()
    @Length(3, 50)
    @ApiPropertyOptional()
    userName?: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    @ApiPropertyOptional()
    email?: string;
}
