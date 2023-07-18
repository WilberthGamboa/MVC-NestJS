import { Controller, Get, Post, Body, Patch, Param, Delete, Render, UseGuards, UseInterceptors, UploadedFile, Res, UseFilters, BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { MyPcService } from './my-pc.service';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { UpdateMyPcDto } from './dto/update-my-pc.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

import { Response } from 'express';
import { MyPcExceptionFilter } from './filters/my-pc.exceptionFilter';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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
  
  
  //@UseGuards(AuthenticatedGuard)
  @Post('/submit')
  @UseInterceptors(FileInterceptor('file',{
    storage:diskStorage({
      destination:'./uploads',
    })
  }),)
  submitMyPc(@UploadedFile(
    new ParseFilePipe({
      validators: [
        //new MaxFileSizeValidator({ maxSize: 1000 }),
        //new FileTypeValidator({ fileType: 'image/jpeg' }),
      ],
    }),
  ) file: Express.Multer.File, @Body() formData: any,@Res() res:Response) {
    /*
    if (!file) {
      throw new BadRequestException('La imagen es obligatoria')
    }
    */
    console.log('Archivo:', file); // Datos del archivo
    console.log('Información adicional:', formData); // Datos adicionales del formulario
    res.redirect('/myPc/submit')
  }
 
}
