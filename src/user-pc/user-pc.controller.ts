import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Redirect, Res } from '@nestjs/common';
import { UserPcService } from './user-pc.service';
import { Response } from 'express';


@Controller('myPcs')
export class UserPcController {
  constructor(private readonly userPcService: UserPcService) {}


  @Get('/')
  
  getAll(@Res() res:Response,@Session() session: Record<string, any>){
 
    if (session.user===undefined) {
      console.log('dentro de login')
      res.redirect('auth/login')
    }else{
      console.log('fuera de login')
      res.render('userPc/myPcs')
    }
   
  }
}
