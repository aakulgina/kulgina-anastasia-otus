import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignUpRequestDto {
    @IsString()
    @ApiPropertyOptional({
        required: false,
        description: 'New user name. If empty, email part up to @ will be taken',
    })
    userName?: string;

    @IsString()
    @ApiProperty({
        required: true,
        description: 'Email to link to the new acc',
    })
    email: string;

    @IsString()
    @ApiProperty({
        required: true,
        description: 'Password to assotiate with given email',
    })
    password: string;
}
