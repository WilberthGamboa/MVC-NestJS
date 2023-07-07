import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res, UsePipes, ValidationPipe, Session, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

import { validate, validateOrReject } from 'class-validator';
import { userValidation } from './entities/validate/user.validate';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    @Get('register')
    @Render('auth/register')
    viewRegister(){
      
      
    }

    @Get('login')
    @Render('auth/login')
    viewLogin(){
      
    }
    
  @Post('register')
   create(@Body() body, @Res() response, @Req() request) {
    const errors = userValidation(body);
    console.log(errors);

    if (errors.length!=0) {
      return response.render('auth/register', { errors }); // Utiliza render en lugar de redirect
    }
    const user = {
      ...body
    }
    request.session.user = user;
    return response.redirect('/auth/login');
  }


  @Get('test')
  test(@Res() response,@Req() request){
    if ( !request.session.user) {
      return response.redirect('/');
    }
    return response.render('auth/test');
  }

  
    
}

