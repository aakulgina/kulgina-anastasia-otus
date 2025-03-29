import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class GetUserProfileResponseDto {
    @IsString()
    @Length(3, 50)
    @ApiProperty({ required: true })
    userName: string;
    
    @IsString()
    @IsEmail()
    @ApiProperty({ required: true })
    email: string;
    
    @IsString()
    @ApiProperty({ required: true })
    lastSeen: Date;
}
