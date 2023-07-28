import { Injectable } from '@nestjs/common';
import { AuthFormErros } from '../interfaces/AuthFormErros.interfaces';
@Injectable()
export class ErrorsFilter {
  public register(errorMessages: string | string[]): AuthFormErros {
    const authFormErros: AuthFormErros = {
      email: [],
      everyone: [],
      password: [],
    };

    if (Array.isArray(errorMessages)) {
      errorMessages.forEach((errorMessage) => {
        if (errorMessage.includes('contraseña')) {
          authFormErros.password.push(errorMessage);
        } else if (errorMessage.includes('correo')) {
          authFormErros.email.push(errorMessage);
        } else {
          authFormErros.everyone.push(errorMessage);
        }
      });
    } else {
      if (errorMessages.includes('contraseña')) {
        authFormErros.password.push(errorMessages);
      } else if (errorMessages.includes('correo')) {
        authFormErros.email.push(errorMessages);
      } else {
        authFormErros.everyone.push(errorMessages);
      }
    }

    return authFormErros;
  }
  /* Esta validación se realiza debido a que la implementación de la librería envía automáticamente el valor de Unauthorized 
  esta implemetación envia mensajes personalizados*/
  public login(errorMessages: string | string[], body: any): AuthFormErros {
    const authFormErros: AuthFormErros = {
      email: [],
      everyone: [],
      password: [],
    };
    if (errorMessages === 'Unauthorized') {
      errorMessages = '';

      if (body.username === '') {
        authFormErros.email.push('El correo no puede estar vacio');
      }
      if (body.password === '') {
        authFormErros.password.push('La contraseña no puede estar vacia');
      }
    } else {
      if (!Array.isArray(errorMessages)) {
        authFormErros.everyone.push(errorMessages);
      }
    }
    return authFormErros;
  }
}
