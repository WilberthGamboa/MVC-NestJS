// src/common/filters/auth-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorsFilter } from '../helper/errorsFilter.helper';
import { IRequestFlash } from 'src/common/interfaces/IRequeestFlash.interface';

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorsFilter: ErrorsFilter) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IRequestFlash>();
    //obtenemos información de la exception
    const errorResponse = exception.getResponse() as {
      statusCode: number;
      message: string | string[];
      error: string;
    };

    // Validación correspondiente al register
    if (exception instanceof BadRequestException) {
      const authFormErros = this.errorsFilter.register(errorResponse.message);
      request.flash('messages', authFormErros);
      response.redirect('/auth/register');
    }
    //Validación correspondiente al login
    else if (exception instanceof UnauthorizedException) {
      const authFormErros = this.errorsFilter.login(
        errorResponse.message,
        request.body,
      );

      if (
        authFormErros.email.length === 0 &&
        authFormErros.password.length === 0 &&
        authFormErros.everyone.length === 0
      ) {
        response.redirect('/');
      } else {
        request.flash('messages', authFormErros);
        response.redirect('/auth/login');
      }
    } else {
      response.redirect('/auth/login');
    }
  }
}
