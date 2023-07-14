import { IsEmail, IsString, IsStrongPassword, Max, Min } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmail()
    email:string;
    
    @IsString()
    password:string;
}
