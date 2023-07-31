import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  Query,
} from '@nestjs/common';
import { MyPcService } from './my-pc.service';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

import { Request, Response } from 'express';
import { MyPcExceptionFilter } from './filters/my-pc.exceptionFilter';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer } from './helper/fileNamer.helper';
import { fileFilter } from './helper/fileFilter.helper';

@Controller('myPc')
@UseFilters(MyPcExceptionFilter)
export class MyPcController {
  constructor(private readonly myPcService: MyPcService) {}

  //*Renderiza el formulario para subir computadoras */
  @UseGuards(AuthenticatedGuard)
  @Get('submit')
  @Render('myPc/submitMyPc')
  renderSubmitMyPc(@Req() req) {
    console.log('submit');
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
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './uploads',
        filename: fileNamer,
      }),
    }),
  )
  async submitMyPc(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMyPcDto: CreateMyPcDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Debes subir una imagen');
    }

    await this.myPcService.submitMyPc(
      createMyPcDto,
      req.user,
      file.filename,
      file.destination,
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
