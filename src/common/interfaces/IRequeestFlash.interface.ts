import { Request } from 'express';

export interface IRequestFlash extends Request {
  flash: any;
}
