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
  Session,
} from '@nestjs/common';
import { MyPcService } from './my-pc.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { Request, Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { UpdateMyPcDto } from './dto/update-my-pc.dto';
import { MyPcExceptionFilter } from './filters/my-pc.exceptionFilter';
import { MyPcsPipe } from './my-pcs.pipe';
import { MyPcFormErros, MyPcFormErrosHbs } from './interfaces/my-pc-formErros.interface';
import { IRequestFlash } from 'src/common/interfaces/IRequeestFlash.interface';


@Controller('myPc')
@UseFilters(MyPcExceptionFilter)
export class MyPcController {
  constructor(private readonly myPcService: MyPcService) {}

  //*Renderiza el formulario para subir computadoras */
  @UseGuards(AuthenticatedGuard)
  @Get('submit')
  @Render('myPc/submitMyPc')
  renderSubmitMyPc(@Req() req : IRequestFlash ): MyPcFormErrosHbs {
    const message = req.flash('messages') as MyPcFormErros;
    return {message};
   
  }
  //*Renderiza MisComputadoras */
  @UseGuards(AuthenticatedGuard)
  @Get('/:id?')
  @Render('myPc/main')
  async getMyPcs(
    @Req() req: Request,
    @Session() session: Record<string, any>,
    @Param('id',MyPcsPipe) id:number,
  ) {
    return await this.myPcService.getAll(req.user,id);
  }

  //*Realiza la petición para subir la pc */
  @UseGuards(AuthenticatedGuard)
  @FormDataRequest()
  @Post('/submit')
  async submitMyPc(
    @Body() createMyPcDto: CreateMyPcDto, 
    @Res() res: Response,
    @Req() req: Request,
  ) {

  
   await this.myPcService.submitMyPc(
      createMyPcDto,
      req.user
    );
  
    res.redirect('/myPc/submit');
  }
  //*Realiza la petición para actualizar la pc */
  @FormDataRequest()
  @Post('edit')
  async updateMyPc(@Req() req,@Res() res:Response, @Body() updateMyPcDto: UpdateMyPcDto){
   // console.log(updateMyPcDto)
  if (updateMyPcDto.file) {
    console.log("hay que cambiar el archivo");
    
  }
   await this.myPcService.updateMyPc(updateMyPcDto.id,req.user,updateMyPcDto);
    res.redirect('/myPc/edit/'+updateMyPcDto.id);
 

  }
  @Get('edit/:id')
  @Render('myPc/editMyPc')
  async updateRenderMyPc(@Param('id') id: string,@Req() req){
    const pc =  await this.myPcService.findMyPc(id,req.user);
   return {
    pc,
    id
   }
  }
  
  @Get('delete/:id')
  async deleteMyPc(@Param('id') id: string, @Req() req, @Res() res:Response){
    await this.myPcService.deleteMyPc(id,req.user)
    res.redirect('/myPc')
    return;
    
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