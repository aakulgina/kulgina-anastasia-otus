import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class ChangeUserProfileRequestDto {
    @IsString()
    @Length(3, 50)
    @ApiPropertyOptional()
    userName?: string;

    @IsString()
    @IsEmail()
    @ApiPropertyOptional()
    email?: string;
}
