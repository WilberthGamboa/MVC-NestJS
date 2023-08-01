import { validate } from "class-validator";
import { CreateMyPcDto } from "../dto/create-my-pc.dto";
import { Request } from "express";

export const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  
  const {nombre,descripcion} = req.body 
  const test={
    nombre,descripcion
  } as CreateMyPcDto
 

  const validationErrors = await validate({test});
  console.log(validationErrors)
  //console.log(validationErrors)
  /*
  if (validationErrors.length > 0) {
    return callback(null, false);
  }
  */
  // console.log({ file })
  if (!file) return callback(new Error('File is empty'), false);

  const fileExptension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(fileExptension)) {
    return callback(null, true);
  }

  callback(null, false);
};
