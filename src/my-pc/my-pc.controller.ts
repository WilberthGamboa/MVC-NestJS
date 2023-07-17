import { Controller, Get, Post, Body, Patch, Param, Delete, Render, UseGuards, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { MyPcService } from './my-pc.service';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { UpdateMyPcDto } from './dto/update-my-pc.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('myPc')
export class MyPcController {
  constructor(private readonly myPcService: MyPcService) {}
  @UseGuards(AuthenticatedGuard)
  @Get()
  @Render('myPc/main')
  getMyPcs(){

  }

  @Get('/submit')
  @Render('myPc/submitMyPc')
  renderSubmitMyPc(){

  }


  @Post('/submit')
  @UseInterceptors(FileInterceptor('file'))
  submitMyPc(@UploadedFile() file: Express.Multer.File, @Body() formData: any,@Res() res:Response) {
    console.log('Archivo:', file); // Datos del archivo
    console.log('Información adicional:', formData); // Datos adicionales del formulario
    res.redirect('myPc/submit')
  }
 
}
