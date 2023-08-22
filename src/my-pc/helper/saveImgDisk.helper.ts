import { MemoryStoredFile } from 'nestjs-form-data';
import * as fs from 'node:fs';
import { fileNamer } from './fileNamer.helper';
import { join } from 'node:path';

export const saveImgDisk = (file: MemoryStoredFile,fileNameUuid:string) => {
   
    const filePath = join(__dirname,'..','..','uploads',fileNameUuid);

    fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
          console.error('Error al guardar el archivo:', err);
        } else {
          console.log('El buffer ha sido guardado exitosamente.');
        }
      });
  
    return 
}