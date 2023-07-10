import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res, UsePipes, ValidationPipe, Session, Req, UseGuards, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userValidation } from './entities/validate/user.validate';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/common/filters/auth-exceptions.filter';
import { LoginGuard } from 'src/common/guards/login.guard';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
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
     
     
      
    }
    @UseGuards(LoginGuard)
    @Post('login')
    createLogin(@Req() req:Request,@Session() session: Record<string, any>,@Res() response:Response) {
      console.log('no ha pasado')
    response.redirect('/myPcs')
   

  
      
   }

    


  
    
}

