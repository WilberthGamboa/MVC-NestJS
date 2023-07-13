import { Controller, Get, Post, Body, Patch, Param, Delete, Render, UseFilters, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthExceptionFilter } from './filters/auth-exceptions.filter';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register')
  @Render('auth/register')
  renderRegister(@Request() req) {
    return{
      message:req.flash('messages')
    }
  }

  @Post('register')
  
  create(@Body() createAuthDto: CreateAuthDto) {

  }

}
