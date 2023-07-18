import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    console.log("Dentro de login")
    const result = (await super.canActivate(context)) as boolean;
    console.log("despues de resutl")
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    console.log("login" +result)
    return result;
  }
}