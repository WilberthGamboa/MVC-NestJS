import {
  Controller,
  Get,
  Post,
  Body,
  Render,
  UseFilters,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthExceptionFilter } from './filters/auth-exceptions.filter';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginGuard } from './guards/login.guard';
import { IRequestFlash } from 'src/common/interfaces/IRequeestFlash.interface';
import { AuthFormErros } from './interfaces/AuthFormErros.interfaces';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //* Renderiza el registro
  @Get('register')
  @Render('auth/register')
  renderRegister(@Req() req: IRequestFlash) {
    const messages: AuthFormErros = req.flash('messages');
    return {
      messages
    }
  }
  // * Envía información del registro
  @Post('register')
  async createUser(
    @Body() createAuthDto: CreateUserDto,
    @Res() response: Response,
  ) {
    await this.authService.createUser(createAuthDto);
    response.redirect('/auth/login');
  }

  //* Renderiza el login

  @Get('login')
  @Render('auth/login')
  renderLogin(@Req() req: IRequestFlash) {
    const messages: AuthFormErros = req.flash('messages');
    return {
      messages,
    };
  }

  //* Envía información del usuario logueado
  @UseGuards(LoginGuard)
  @Post('login')
  postLogin(@Res() response: Response) {
    response.redirect('/myPc');
  }

  // *Hace el logout del usuario y redirecciona al / de la app
  @Get('logout')
  logout(@Res() response: Response, @Req() req) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });

    response.redirect('/');
  }
}
