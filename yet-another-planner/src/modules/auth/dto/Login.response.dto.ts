import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginResponseDto {
    @IsString()
    @ApiProperty({
        required: true,
        description: 'Logged in user name',
    })
    userName: string;
}
