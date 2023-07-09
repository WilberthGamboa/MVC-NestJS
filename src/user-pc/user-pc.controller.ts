import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Redirect, Res, UseGuards, UseFilters } from '@nestjs/common';
import { UserPcService } from './user-pc.service';
import { Response } from 'express';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/common/filters/auth-exceptions.filter';


@Controller('myPcs')
@UseFilters(AuthExceptionFilter)
export class UserPcController {
  constructor(private readonly userPcService: UserPcService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('/')
  getAll(@Res() res:Response,@Session() session: Record<string, any>){
 
   
  }
}
