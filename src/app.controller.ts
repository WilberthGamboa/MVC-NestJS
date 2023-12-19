import { Get, Controller, Render, UseFilters, Req, Param } from '@nestjs/common';
import { NotFoundFilter } from './common/filters/notFoundFilter-exceptions.filter';
import { IRequestUser } from './common/interfaces/IRequestUser.interface';
import { MyPcsPipe } from './my-pc/my-pcs.pipe';
import { AppService } from './app.service';

@Controller('/')
@UseFilters(NotFoundFilter)
export class AppController {
  constructor(private readonly myPcService: AppService) {}
  @Get('/:id([0-9]+)?')
  @Render('index')
  async root(@Req() req: IRequestUser, @Param('id', MyPcsPipe) id: number) {
    const allMyPc = await this.myPcService.getAllMyPc(id);

    if (req.user) {
      const userEmail = req.user.email;
      return {
        userEmail,
        allMyPc
      }
   
    }else {
      return {
        allMyPc
      }
    }
  

   
  }
}
