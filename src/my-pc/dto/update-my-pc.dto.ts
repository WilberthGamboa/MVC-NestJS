import { PartialType } from '@nestjs/mapped-types';
import { CreateMyPcDto } from './create-my-pc.dto';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';
import { IsOptional, ValidationArguments } from 'class-validator';

export class UpdateMyPcDto extends PartialType(CreateMyPcDto) {
    
    id:string;

    @IsOptional()
    nombre?: string;

    @IsOptional()
    descripcion?: string;

    @IsOptional()
    @HasMimeType(['image/jpeg', 'image/png','image/webp'],{message : (validationArguments:ValidationArguments) =>{
        return  `La imagen debe tener los siguientes formatos: ${validationArguments.constraints.toString()}`
    }})
    @IsFile({message:"La imagen es obligatoria"})
    file?:MemoryStoredFile;
}
