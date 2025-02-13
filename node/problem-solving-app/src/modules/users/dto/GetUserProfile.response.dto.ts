import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetUserProfileResponseDto {
    @IsString()
    @ApiProperty({ required: true })
    id: string;
    
    @IsString()
    @ApiProperty({ required: true })
    userName: string;
    
    @IsString()
    @ApiProperty({ required: true })
    email: string;
    
    @IsString()
    @ApiProperty({ required: true })
    lastSeen: Date;
}
