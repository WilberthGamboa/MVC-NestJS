import { IsString, Min } from "class-validator";

export class CreateAuthDto {
    @IsString()
    @Min(1)
    email:string;
    
    @IsString()
    @Min(1)
    password:string;
}
