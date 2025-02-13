import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @ApiProperty({ required: true })
    userName: string;
    
    @IsString()
    @ApiProperty({ required: true })
    email: string;
    
    @IsString()
    @ApiProperty({ required: true })
    password: string;
}
