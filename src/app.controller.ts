
import { Get, Controller, Render, UseFilters } from '@nestjs/common';
import { NotFoundFilter } from './common/filters/auth-exceptions.filter';


@Controller()
@UseFilters(NotFoundFilter)
export class AppController {
  @Get('/')
  @Render('index')
  root() {
    return;
  }


}