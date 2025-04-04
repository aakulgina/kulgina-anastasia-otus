import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsStrongPassword } from "class-validator";

export class ChangeUserPasswordRequestDto {
    @IsString()
    @ApiProperty({ required: true })
    currentPassword: string;

    @IsString()
    @IsStrongPassword()
    @ApiProperty({ required: true })
    newPassword: string;
}
