import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  UseFilters,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
  Session,
} from '@nestjs/common';
import { MyPcService } from './my-pc.service';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { Request, Response } from 'express';
import { MyPcExceptionFilter } from './filters/my-pc.exceptionFilter';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileNamer } from './helper/fileNamer.helper';
import * as fs from 'fs';
import { join } from 'node:path';
@Controller('myPc')
@UseFilters(MyPcExceptionFilter)
export class MyPcController {
  constructor(private readonly myPcService: MyPcService) {}

  //*Renderiza el formulario para subir computadoras */
  @UseGuards(AuthenticatedGuard)
  @Get('submit')
  @Render('myPc/submitMyPc')
  renderSubmitMyPc(@Req() req) {
   
    return {
      message: req.flash('messages'),
    };
  }
  //*Renderiza MisComputadoras */
  @UseGuards(AuthenticatedGuard)
  @Get('/:id?')
  @Render('myPc/main')
  async getMyPcs(
    @Req() req: Request,
    @Session() session: Record<string, any>,
    @Param('id') id,
  ) {
    return await this.myPcService.getAll(req.user, session, id);
  }

  //*Realiza la petición para subir la pc */
  @UseGuards(AuthenticatedGuard)
  @Post('/submit')
  @UseInterceptors(
    FileInterceptor('file')
    
  )
  async submitMyPc(
    @Body() createMyPcDto: CreateMyPcDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000000000000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg|png' }),
        ],
      }),
    )
    file: Express.Multer.File,
   
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const fileName = fileNamer(file);
    const filePath = join(__dirname,'..','..','uploads',fileName);
    console.log(filePath)
    console.log(file.buffer)
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        console.error('Error al guardar el archivo:', err);
      } else {
        console.log('El buffer ha sido guardado exitosamente.');
      }
    });
  
    await this.myPcService.submitMyPc(
      createMyPcDto,
      req.user,
      fileName
   
    );
   
    res.redirect('/myPc/submit');
  }

  //*Permite renderizar las imágenes */
  @UseGuards(AuthenticatedGuard)
  @Get('see/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.myPcService.getStaticProductImage(imageName);

    res.sendFile(path);
  }
}