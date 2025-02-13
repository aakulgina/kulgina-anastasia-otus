import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ChangeUserPasswordRequestDto {
    @IsString()
    @ApiProperty({ required: true })
    currentPassword: string;

    @IsString()
    @ApiProperty({ required: true })
    newPassword: string;
}
