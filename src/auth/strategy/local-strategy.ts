import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    
    const error = new UnauthorizedException();
      error.getResponse = () => ({
        redirect: '/error-route', // Ruta a la que se redirigirá
        message: 'Error de redirección',
        status: 500,
      });
      throw error;
  }
}
