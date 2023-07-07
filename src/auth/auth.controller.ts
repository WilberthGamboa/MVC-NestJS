import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res, UsePipes, ValidationPipe, Session, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userValidation } from './entities/validate/user.validate';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    @Get('register')
    @Render('auth/register')
    viewRegister(){
      
      
    }
 
    @Post('register')
    create(@Body() body:Request, @Res() response:Response) {
      this.authService.create(body,response)
   }


    @Get('login')
    @Render('auth/login')
    viewLogin(@Body() body:Request, @Res() response:Response, @Session() session: Record<string, any>){
     
      if(Object.keys(body).length === 0){
        return;
     }
     const user = {
      ...body
    }
    session.user= user;
    response.render('userPc/myPcs') 
      
    }

    @Post('register')
    createLogin(@Body() body:Request, @Res() response:Response) {
      this.authService.create(body,response)
   }

    


  
    
}

