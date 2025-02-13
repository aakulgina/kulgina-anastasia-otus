import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginRequestDto {
    @IsString()
    @ApiProperty({
        required: true,
        description: 'Email linked to the user acc',
    })
    email: string;

    @IsString()
    @ApiProperty({
        required: true,
        description: 'Password assotiated with given email',
    })
    password: string;
}
