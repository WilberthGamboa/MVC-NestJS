import { Controller, Get, Post, Body, Patch, Param, Delete, Render, UseFilters, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthExceptionFilter } from './filters/auth-exceptions.filter';
import {  Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginGuard } from './guards/login.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Controladores encargados del registro 
  @Get('register')
  @Render('auth/register')
  renderRegister(@Req() req) {
    return{
      messages:req.flash('messages')
    }
  }

  @Post('register')
  async createUser(@Body() createAuthDto:CreateUserDto, @Res() response:Response) {
     await this.authService.createUser(createAuthDto);
     response.redirect('/auth/login')
  }

  // Controladores encargados del login 

  @Get('login')
  @Render('auth/login')
  renderLogin(@Req() req){
    return{
      messages:req.flash('messages')
    }
  }

  @UseGuards(LoginGuard)
  @Post('login')
  postLogin(@Res()response:Response){
    response.redirect('/myPc')
  }

  @UseGuards(LoginGuard)
  @Get('logout')
  logout(@Res()response:Response,@Req() req){
    req.logout()
   
  }

}
