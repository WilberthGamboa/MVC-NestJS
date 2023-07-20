import { IsNotEmpty, IsString } from "class-validator";

export class CreateMyPcDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion:string;

    

}
