import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';



@Injectable()
export class AuthService {
users: { userId: number; username: string; password: string; pet: { name: string; picId: number; }; }[];
  
constructor(

  @InjectModel(User.name)
  private readonly userModel: Model<User>

){

}

  async createUser(createAuthDto:CreateUserDto){
    try {
      await this.userModel.create(createAuthDto);
    } catch (error) {
      console.log(error.code)
      this.handleDbException(error)
    }



  }

  private handleDbException(error:any){
    if (error.code===11000) {
      throw new BadRequestException('EL correo ya está registrado')
    }else{
      throw new InternalServerErrorException(`Cant create Pokemon - Check server logs`);
    }
  }
  
}
  

