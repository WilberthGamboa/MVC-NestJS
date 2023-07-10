// src/common/filters/auth-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface IRequestFlash extends Request {
  flash: any;
}

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IRequestFlash>();
    console.log(request.route)
    console.log(request.url)
    console.log(request.originalUrl)

    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      if (request.url!='/myPcs') {
        request.flash('errors', 'Please try again!');
      }
      
      response.redirect('/auth/login')
    } else {
      response.redirect('/error');
    }
  }
}
