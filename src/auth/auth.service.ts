import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bycript from 'bcrypt'
@Injectable()
export class AuthService {
  users: {
    userId: number;
    username: string;
    password: string;
    pet: { name: string; picId: number };
  }[];

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(createAuthDto: CreateUserDto) {
    try {
     const {password,...restData} = createAuthDto
      await this.userModel.create({
        ...restData,
        password:bycript.hashSync(password,10)
      });
    } catch (error) {
      console.log(error.code);
      this.handleDbException(error);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }, '-__v');
    console.log(user);

    if (!user ||  !bycript.compareSync(password,user?.password)) {
      throw new UnauthorizedException('Usuario o contraseña no válidos');
    }
    return user;
  }

  private handleDbException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('EL correo ya está registrado');
    } else {
      throw new InternalServerErrorException(`No se pudo crear el usuario`);
    }
  }
}
