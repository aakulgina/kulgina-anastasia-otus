import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignUpResponseDto {
    @IsString()
    @ApiProperty({
        required: true,
        description: 'New user\'s personal id'
    })
    userName: string;
}
