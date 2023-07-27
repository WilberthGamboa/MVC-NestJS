import { Controller, Get, Post, Body, Patch, Param, Delete, Render, UseGuards, UseInterceptors, UploadedFile, Res, UseFilters, BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req, Session, Query } from '@nestjs/common';
import { MyPcService } from './my-pc.service';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { UpdateMyPcDto } from './dto/update-my-pc.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

import { Request, Response } from 'express';
import { MyPcExceptionFilter } from './filters/my-pc.exceptionFilter';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer } from './helper/fileNamer.helper';
import { fileFilter } from './helper/fileFilter.helper';
@UseFilters(MyPcExceptionFilter)
@Controller('myPc')
export class MyPcController {
  constructor(private readonly myPcService: MyPcService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  @Render('myPc/main')
  async getMyPcs(@Req() req:Request, @Session() session: Record<string, any>,@Query() query ){

    return  await this.myPcService.getAll(req.user,session,query.offset);

    /*
    
        const offset = Number(query.offset)
        if (!isNaN(offset)) {
          session.currentPage=offset
        }
    


    if (!session.currentPage|| session.currentPage<=1 || offset===0) {
     
        session.currentPage=1;
        session.nextPage=2;
        session.previousPage=1;
    }else{
      session.currentPage=offset;
      
      session.nextPage=offset+1;
      session.previousPage=offset-1;
    }
   

    let pc =  await this.myPcService.getAll(req.user,session.currentPage);
    if(pc.length===0){

      session.currentPage= session.currentPage-1
      session.nextPage=session.nextPage-1;
      if (session.currentPage===1) {
        session.previousPage=1;
    
      }else{
        session.previousPage=session.previousPage-1;
      }

      pc =  await this.myPcService.getAll(req.user,session.currentPage);
    }
     const pcConFotos = pc.map(x=>{
     // console.log(x)
      const {image ,...restoPc} = x;
      const nuevaImagen = "http://localhost:3000/myPc/see/"+image;
     // console.log(nuevaImagen)
      return {
        ...restoPc,
        nuevaImagen
      }

     })
    // console.log(pcConFotos)
    */
   
    
  }
  @UseGuards(AuthenticatedGuard)
  @Get('/submit')
  @Render('myPc/submitMyPc')
  async renderSubmitMyPc(@Req() req){
     
    return {
      data : req.flash('messages')
    }
     

  }
  
  @UseGuards(AuthenticatedGuard)
  @Post('/submit')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter:fileFilter,
    storage:diskStorage({
      destination:'./uploads',
      filename:fileNamer
    })
  }),)
  async submitMyPc(@UploadedFile(
    
  ) file: Express.Multer.File, @Body() createMyPcDto: CreateMyPcDto,@Res() res:Response,@Req() req:Request) {

    if (!file) {
      throw new BadRequestException('El formato de la imagen es incorrecta, verifica que sea: jpg jpeg png gif ')
      
    }

    await this.myPcService.submitMyPc(createMyPcDto,req.user,file.filename,file.destination)
    res.redirect('/myPc/submit')
  }


  
  @UseGuards(AuthenticatedGuard)
  @Get('see/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.myPcService.getStaticProductImage( imageName );

    res.sendFile( path );
  }
  
 
}
