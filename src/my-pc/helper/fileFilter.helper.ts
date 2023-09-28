import { validate } from 'class-validator';
import { CreateMyPcDto } from '../dto/create-my-pc.dto';
import { Request } from 'express';

export const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  const fileExptension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(fileExptension)) {
    return callback(null, true);
  }

  callback(null, false);
};
