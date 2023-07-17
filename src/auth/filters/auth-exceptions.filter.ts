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
      } 
      else if (
        exception instanceof UnauthorizedException
      ) {
        if (errorResponse.message==='Unauthorized'){
            errorResponse.message=''
            const messages = [];
            if (request.body.username==='') {
              messages.push('El username no puede estar vacio')
            }
            if (request.body.password==='') {
              messages.push('La contraseña no puede estar vacia')
            }
            errorResponse.message=messages
        }
        request.flash('messages', errorResponse.message);
        response.redirect('/auth/login')
        
      } 
     
      else{
        response.redirect('/auth/login')
      }



    }
  }