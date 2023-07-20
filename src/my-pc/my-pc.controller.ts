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
  async getMyPcs(@Req() req:Request){
    
    const pc =  await this.myPcService.getAll(req.user);
     const pcConFotos = pc.map(x=>{
      console.log(x)
      const {image ,...restoPc} = x;
      const nuevaImagen = "http://localhost:3000/myPc/see/"+image;
      console.log(nuevaImagen)
      return {
        ...restoPc,
        nuevaImagen
      }

     })
     console.log(pcConFotos)
    return{
      data: pcConFotos
    }
    
  }
  @UseGuards(AuthenticatedGuard)
  @Get('/submit')
  @Render('myPc/submitMyPc')
  async renderSubmitMyPc(){
     
     

  }
  
  
  @UseGuards(AuthenticatedGuard)
  @Post('/submit')
  @UseInterceptors(FileInterceptor('file',{
    storage:diskStorage({
      destination:'./uploads',
      filename:fileNamer
    })
  }),)
  async submitMyPc(@UploadedFile(
    
  ) file: Express.Multer.File, @Body() createMyPcDto: CreateMyPcDto,@Res() res:Response,@Req() req:Request) {

    await this.myPcService.submitMyPc(createMyPcDto,req.user,file.filename,file.destination)
    res.redirect('/myPc/submit')
  }

  @Get('see/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.myPcService.getStaticProductImage( imageName );

    res.sendFile( path );
  }
  
 
}
