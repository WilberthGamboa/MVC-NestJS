import { IsNotEmpty, IsString, ValidationArguments } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';


export class CreateMyPcDto {
  @IsString()
  @IsNotEmpty({message:'El nombre es obligatorio'})
  nombre: string;

  @IsString()
  @IsNotEmpty({message:'La descripción es obligatoria'})
  descripcion: string;

  @HasMimeType(['image/jpeg', 'image/png','image/webp','image/jpg'],{message : (validationArguments:ValidationArguments) =>{
    return  `La imagen debe tener los siguientes formatos: ${validationArguments.constraints.toString()}`
  }})
  @IsFile({message:"La imagen es obligatoria",always:false})
  file:MemoryStoredFile;
}
