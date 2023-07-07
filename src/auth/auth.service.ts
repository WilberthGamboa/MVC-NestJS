import { Injectable } from '@nestjs/common';
import { userValidation } from './entities/validate/user.validate';
import { Request, Response } from 'express';


@Injectable()
export class AuthService {
       // TODO: validar que los datos correctamente 
    create(body:Request,response:Response) {
        const errors = userValidation(body);
    
        if (errors.length!=0) {
          return response.render('auth/register', { errors }); // Utiliza render en lugar de redirect
        }
      
        return response.redirect('/auth/login');

    }

    

}
