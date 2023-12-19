import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  UseGuards,
  Res,
  UseFilters,
  Req,
} from '@nestjs/common';
import { MyPcService } from './my-pc.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { UpdateMyPcDto } from './dto/update-my-pc.dto';
import { MyPcExceptionFilter } from './filters/my-pc.exceptionFilter';
import { MyPcsPipe } from './my-pcs.pipe';
import {
  MyPcFormErros,
  MyPcFormErrosHbs,
} from './interfaces/my-pc-formErros.interface';
import { IRequestFlash } from 'src/common/interfaces/IRequeestFlash.interface';
import { IRequestUser } from 'src/common/interfaces/IRequestUser.interface';

@Controller('myPc')
@UseFilters(MyPcExceptionFilter)
export class MyPcController {

  constructor(private readonly myPcService: MyPcService) {}

  //*Renderiza el formulario para subir computadoras */
  @UseGuards(AuthenticatedGuard)
  @Get('submit')
  @Render('myPc/submitMyPc')
  renderSubmitMyPc(@Req() req: IRequestFlash) {
    const message = req.flash('messages') as MyPcFormErros;
    const userEmail = req.user['email']
    return { message,userEmail };
  }
  /*Renderiza MisComputadoras */
  @UseGuards(AuthenticatedGuard)
  @Get('/:id?')
  @Render('myPc/main')
  async getMyPcs(@Req() req: IRequestUser, @Param('id', MyPcsPipe) id: number) {
  
    const allMyPc = await this.myPcService.getAllMyPc(req.user, id);
    const userEmail = req.user.email;
    return {allMyPc,userEmail}
    
    
  }

  //*Realiza la petición para subir la pc */
  @UseGuards(AuthenticatedGuard)
  @FormDataRequest()
  @Post('/submit')
  async submitMyPc(
    @Body() createMyPcDto: CreateMyPcDto,
    @Res() res: Response,
    @Req() req: IRequestUser,
  ) {
    await this.myPcService.submitMyPc(createMyPcDto, req.user);

    res.redirect('/myPc');
  }
  //*Realiza la petición para actualizar la pc */
  @UseGuards(AuthenticatedGuard)
  @FormDataRequest()
  @Post('edit')
  async updateMyPc(
    @Req() req: IRequestUser,
    @Res() res: Response,
    @Body() updateMyPcDto: UpdateMyPcDto,
  ) {
    await this.myPcService.updateMyPc(
      updateMyPcDto.id,
      req.user,
      updateMyPcDto,
    );
    res.redirect('/myPc/edit/' + updateMyPcDto.id);
  }
  @UseGuards(AuthenticatedGuard)
  @Get('edit/:id')
  @Render('myPc/editMyPc')
  async updateRenderMyPc(@Param('id') id: string, @Req() req: IRequestUser) {
    const pc = await this.myPcService.findMyPc(id, req.user);
    const userEmail = req.user.email;
    return {
      pc,
      id,
      userEmail
    };
  }
  /* Borrar y redirecciona al menu*/
  @UseGuards(AuthenticatedGuard)
  @Get('delete/:id')
  async deleteMyPc(
    @Param('id') id: string,
    @Req() req: IRequestUser,
    @Res() res: Response,
  ) {
    await this.myPcService.deleteMyPc(id, req.user);
    res.redirect('/myPc');
  }

  //*Permite renderizar las imágenes */
  
  @Get('see/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.myPcService.getStaticProductImage(imageName);
    res.sendFile(path);
  }
}
