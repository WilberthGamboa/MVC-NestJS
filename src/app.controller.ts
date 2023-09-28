import { Get, Controller, Render, UseFilters, Req } from '@nestjs/common';
import { NotFoundFilter } from './common/filters/notFoundFilter-exceptions.filter';

@Controller()
@UseFilters(NotFoundFilter)
export class AppController {
  @Get('/')
  @Render('index')
  root(@Req() req) {
    const isLogin = true;
    if (req.user) return { isLogin };
  }
}
