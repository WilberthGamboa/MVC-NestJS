// src/common/filters/auth-exceptions.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    UnauthorizedException,
    ForbiddenException,
    BadRequestException,
    NotFoundException,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  interface IRequestFlash extends Request {
    flash: any;
  }
  
  @Catch(HttpException)
  export class NotFoundFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<IRequestFlash>();
     
      console.log("hola desde not found ")
      const errorResponse = exception.getResponse() as {
        statusCode: number;
        message: string | string[];
        error: string;
      };
    
   
      if (
        exception instanceof NotFoundException
      ) {
       
        response.render('errors/404')
      } else {
       
       
      }
    }
  }