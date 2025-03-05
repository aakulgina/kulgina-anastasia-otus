import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator";

export class SignUpRequestDto {
    @IsString()
    @Length(3, 50)
    @ApiPropertyOptional({
        required: false,
        description: 'New user name. If empty, email part up to @ will be taken',
    })
    userName?: string;

    @IsString()
    @IsEmail()
    @ApiProperty({
        required: true,
        description: 'Email to link to the new acc',
    })
    email: string;

    @IsString()
    @IsStrongPassword()
    @ApiProperty({
        required: true,
        description: 'Password to assotiate with given email',
    })
    password: string;
}
