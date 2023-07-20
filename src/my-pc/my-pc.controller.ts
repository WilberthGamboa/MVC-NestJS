import { Controller, Get, Post, Body, Patch, Param, Delete, Render, UseGuards, UseInterceptors, UploadedFile, Res, UseFilters, BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req } from '@nestjs/common';
import { MyPcService } from './my-pc.service';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { UpdateMyPcDto } from './dto/update-my-pc.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

import { Request, Response } from 'express';
import { MyPcExceptionFilter } from './filters/my-pc.exceptionFilter';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer } from './helper/fileNamer.helper';
@UseFilters(MyPcExceptionFilter)
@Controller('myPc')
export class MyPcController {
  constructor(private readonly myPcService: MyPcService) {}
  @UseGuards(AuthenticatedGuard)
  @Get()
  @Render('myPc/main')
  getMyPcs(){
    
  }
  //@UseGuards(AuthenticatedGuard)
  @Get('/submit')
  @Render('myPc/submitMyPc')
  renderSubmitMyPc(){

  }
  
  
  @UseGuards(AuthenticatedGuard)
  @Post('/submit')
  @UseInterceptors(FileInterceptor('file',{
    storage:diskStorage({
      destination:'./uploads',
      filename:fileNamer
    })
  }),)
  submitMyPc(@UploadedFile(
    
  ) file: Express.Multer.File, @Body() createMyPcDto: CreateMyPcDto,@Res() res:Response,@Req() req:Request) {

    //this.submitMyPc()
    /*
    if (!file) {
      throw new BadRequestException('La imagen es obligatoria')
    }
    */
   console.log(req.user)
   console.log("destino:  "+ file.destination)
   console.log("nombre:  "+ file.filename)
    console.log('Archivo:', file); // Datos del archivo
    console.log('Información adicional:', createMyPcDto); // Datos adicionales del formulario
    res.redirect('/myPc/submit')
  }
 
}
