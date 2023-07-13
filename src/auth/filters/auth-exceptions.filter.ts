// src/common/filters/auth-exceptions.filter.ts
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
  
  interface IRequestFlash extends Request {
    flash: any;
  }
  
  @Catch(HttpException)
  export class AuthExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<IRequestFlash>();
  
      
      const errorResponse = exception.getResponse() as {
        statusCode: number;
        message: string | string[];
        error: string;
      };
    
    
      if (
        exception instanceof BadRequestException
      ) {
        console.log(errorResponse)
        request.flash('messages', errorResponse.message);
        response.redirect('/auth/register')
      } else {
       
        
      }
    }
  }