import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { UpdateMyPcDto } from './dto/update-my-pc.dto';
import { Model, Types } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { MyPc } from './entities/my-pc.entity';

import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MyPcService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(MyPc.name)
    private readonly myPcModel: Model<MyPc>,
  ) {}

  async submitMyPc(
    createMyPcDto: CreateMyPcDto,
    user,
    fileName
  ) {
    let userEntity;
    const path = fileName;
    try {
      const id = new Types.ObjectId(user._id);
      userEntity = {
        ...createMyPcDto,
        user: id,
        image: path,
      };
      await this.myPcModel.create(userEntity);
    } catch (error) {
      console.log(error);
      this.handleDbException(error);
    }
    return;
  }

  async getAll(user, session, offset = 1) {
    let isEnabledBtnPreviousPage = true;
    let isEnabledBtnNextPage = true;

    // validamos el offset
    offset = Number(offset);
    if (!isNaN(offset)) {
      if (offset <= 0) {
        offset = 1;
      }
      session.currentPage = offset;
      session.previousPage = session.currentPage - 1;
      session.nextPage = session.currentPage + 1;
    } else {
      offset = 1;
      session.currentPage = offset;
      session.previousPage = session.currentPage - 1;
      session.nextPage = session.currentPage + 1;
    }
    // Obtenemos las pc
    const pcs = await this.myPcModel
      .find({ user: new Types.ObjectId(user._id) })
      .lean()
      .limit(1)
      .skip(offset - 1);
    const nextPcs = await this.myPcModel
      .find({ user: new Types.ObjectId(user._id) })
      .lean()
      .limit(1)
      .skip(offset);

    // Validamos por si el usuario realiza paginado por url

    //Desactivamos los botones

    if (session.currentPage === 1) {
      isEnabledBtnPreviousPage = false;
    }

    if (nextPcs.length === 0) {
      isEnabledBtnNextPage = false;
    }

    // Agregamos la url de las fotos
    const pcsWithUrlImage = pcs.map((pc) => {
      // console.log(x)
      const { image, ...restoPc } = pc;
      const urlImage = 'http://localhost:3000/myPc/see/' + image;
      // console.log(nuevaImagen)
      return {
        ...restoPc,
        urlImage,
      };
    });
    /*

        if (!session.currentPage || session.currentPage <= 1 || offset === 0) {

            session.currentPage = 1;
            session.nextPage = 2;
            session.previousPage = 1;
        } else {
            session.currentPage = offset;

            session.nextPage = offset + 1;
            session.previousPage = offset - 1;
        }

*/
    return {
      pcsWithUrlImage,
      isEnabled: {
        isEnabledBtnPreviousPage,
        isEnabledBtnNextPage,
      },
      pagination: {
        currentPage: session.currentPage,
        nextPage: session.nextPage,
        previousPage: session.previousPage,
      },
    };
  }

  private handleDbException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('Ya existe ');
    } else {
      throw new InternalServerErrorException(
        `Cant create  - Check server logs`,
      );
    }
  }

  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../uploads/', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException('No se encontró la imagen: ' + imageName);
    }

    return path;
  }
}
