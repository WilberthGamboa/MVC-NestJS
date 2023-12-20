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
import { IRequestFlash } from 'src/common/interfaces/IRequeestFlash.interface';

@Catch(HttpException)
export class MyPcExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log("holaxd")
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IRequestFlash>();
  
    const errorResponse = exception.getResponse() as {
      statusCode: number;
      message: string | string[];
      error: string;
    };
    console.log(errorResponse.message);
    if (exception instanceof BadRequestException) {
      const myPcFormErros: MyPcFormErros = {
        nombre: [],
        descripcion: [],
        file: [],
        everyone: [],
      };

      if (Array.isArray(errorResponse.message)) {
        errorResponse.message.forEach((message) => {
          if (message.includes('nombre')) {
            myPcFormErros.nombre.push(message);
          } else if (message.includes('descripción')) {
            myPcFormErros.descripcion.push(message);
          } else if (message.includes('imagen')) {
            myPcFormErros.file.push(message);
          } else {
            myPcFormErros.everyone.push(message);
          }
        });
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
