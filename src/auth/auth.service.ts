import { Injectable } from '@nestjs/common';

import { Request, Response } from 'express';


@Injectable()
export class AuthService {
    users: { userId: number; username: string; password: string; pet: { name: string; picId: number; }; }[];

    constructor(){
      this.users = [
        {
          userId: 1,
          username: 'w',
          password: 'w',
          pet: { name: 'alfred', picId: 1 },
        },
        {
          userId: 2,
          username: 'chris',
          password: 'secret',
          pet: { name: 'gopher', picId: 2 },
        },
        {
          userId: 3,
          username: 'maria',
          password: 'guess',
          pet: { name: 'jenny', picId: 3 },
        },
      ];
    }
       // TODO: validar que los datos correctamente
   

     async findOne(username: string): Promise<any> {
      return this.users.find(user => user.username === username);
    }
    async validateUser(username, pass): Promise<any> {
      const user = await this.findOne(username);
      if (user && user.password === pass) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }

    

}
