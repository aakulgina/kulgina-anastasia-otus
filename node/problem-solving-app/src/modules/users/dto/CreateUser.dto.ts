import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(3, 50)
    @ApiProperty({ required: true })
    userName: string;
    
    @IsString()
    @IsEmail()
    @ApiProperty({ required: true })
    email: string;
    
    @IsString()
    @IsStrongPassword()
    @ApiProperty({ required: true })
    password: string;
}
