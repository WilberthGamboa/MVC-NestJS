import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MyPcFormErros } from '../interfaces/my-pc-formErros.interface';

interface IRequestFlash extends Request {
  flash: any;
}

@Catch(HttpException)
export class MyPcExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception.cause);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IRequestFlash>();

    const errorResponse = exception.getResponse() as {
      statusCode: number;
      message: string | string[];
      error: string;
    };

    if (exception instanceof BadRequestException) {
      const myPcFormErros: MyPcFormErros = {
        nombre: [],
        descripcion: [],
        file: [],
        everyone: [],
      };
      if (request.file === undefined) {
        myPcFormErros.file.push('La imagen es obligatoria');
      }
      console.log(errorResponse.message);
      console.log(request.file);

      if (!Array.isArray(errorResponse.message)) {
        if (errorResponse.message.includes('imagen')) {
          myPcFormErros.file.push(errorResponse.message);
        }
      }

      request.flash('messages', myPcFormErros);
      response.redirect('/myPc/submit');
    } else if (exception instanceof UnauthorizedException) {
      if (errorResponse.message === 'Unauthorized') {
        errorResponse.message = '';
        const messages = [];
        if (request.body.username === '') {
          messages.push('El username no puede estar vacio');
        }
        if (request.body.password === '') {
          messages.push('La contraseña no puede estar vacia');
        }
        errorResponse.message = messages;
      }
      request.flash('messages', errorResponse.message);
      response.redirect('/auth/login');
    } else {
      response.redirect('/auth/login');
    }
  }
}


