import * as fs from 'fs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { UpdateMyPcDto } from './dto/update-my-pc.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MyPc } from './entities/my-pc.entity';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileNamer } from './helper/fileNamer.helper';
import { saveImgDisk } from './helper/saveImgDisk.helper';
import { ISessionUser } from 'src/common/interfaces/IRequestUser.interface';
import { User } from 'src/auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyPcService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(MyPc.name)
    private readonly myPcModel: Model<MyPc>,
    private configService: ConfigService
  ) {}
  /* Se encarga de la subida de pc*/
  async submitMyPc(createMyPcDto: CreateMyPcDto, user: any) {
    //TODO: Almacenar la imagen en disco
    const fileNameUuid = fileNamer(createMyPcDto.file.extension);
    saveImgDisk(createMyPcDto.file, fileNameUuid);

    try {
      const id = new Types.ObjectId(user._id);
      const userEntity = {
        ...createMyPcDto,
        user: id,
        image: fileNameUuid,
      };
      await this.myPcModel.create(userEntity);
    } catch (error) {
      this.handleDbException(error);
    }
  }
  /* Methods get pcs | pc */
  async getAllMyPc(user: ISessionUser, id: number) {
    const limit = 3;
    let isEnabledBtnPreviousPage = true;
    let isEnabledBtnNextPage = true;
    const pagination = {
      currentPage: id,
      nextPage: id + 1,
      previousPage: id - 1,
    };

    // Obtenemos las pc

    const pcs = await this.myPcModel
      .find({ user: new Types.ObjectId(user._id.toString()) })
      .lean()
      .limit(limit)
      .skip((id - 1) * 3);
    const nextPcs = await this.myPcModel
      .find({ user: new Types.ObjectId(user._id.toString()) })
      .lean()
      .limit(limit)
      .skip(id * 3);

    //Desactivamos los botones

    if (id === 1) {
      isEnabledBtnPreviousPage = false;
    }

    if (nextPcs.length === 0) {
      isEnabledBtnNextPage = false;
    }

    // Agregamos la url de las fotos
    const baseUrl = this.configService.get('URL')
    const pcsWithUrlImage = pcs.map((pc) => {
      const { image, _id, ...restoPc } = pc;
      const urlImage = baseUrl + 'myPc/see/' + image;
      const urlEditPc = baseUrl + 'myPc/edit/' + _id;
      const urlDelete = baseUrl + 'myPc/delete/' + _id;

      return {
        ...restoPc,
        urlImage,
        urlEditPc,
        urlDelete,
      };
    });

    return {
      pcsWithUrlImage,
      isEnabled: {
        isEnabledBtnPreviousPage,
        isEnabledBtnNextPage,
      },
      pagination,
      baseUrl
      
    };
  }

  async findMyPc(id: string, user: ISessionUser) {
    try {
      const pc = await this.myPcModel.findById(id);
      if (pc.user.toString() != user._id) {
        throw new BadRequestException('La computadora no le pertenece');
      }

      return pc;
    } catch (error) {
      console.log(error);
    }
  }
  /* Actualizar una pc */
  async updateMyPc(
    id: string,
    user: ISessionUser,
    updateMyPcDto: UpdateMyPcDto,
  ) {
    let updateTemporal = {};
    updateTemporal = {
      ...updateMyPcDto,
    };
    const pc = await this.findMyPc(id, user);
    if (pc) {
      if (updateMyPcDto.file) {
        const filePath = join(__dirname, '..', '..', '..', 'uploads', pc.image);

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error al eliminar el archivo:', err);
          } else {
            console.log('Archivo eliminado exitosamente.');
          }
        });
        const fileNameUuid = fileNamer(updateMyPcDto.file.extension);
        saveImgDisk(updateMyPcDto.file, fileNameUuid);

        updateTemporal = {
          ...updateMyPcDto,
          image: fileNameUuid,
        };
      }
      await this.myPcModel.findByIdAndUpdate(pc.id, updateTemporal);
    }
  }
  /* borrar una pc */
  async deleteMyPc(id: string, user: ISessionUser) {
    const pc = await this.findMyPc(id, user);
    await this.myPcModel.deleteOne(pc._id);
  }

  /* Devuelve el path de la imagen */
  getStaticProductImage(imageName: string): string {
    const path = join(__dirname, '../../uploads/', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException('No se encontró la imagen: ' + imageName);
    }
    return path;
  }

  /** Private methods */
  private handleDbException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('Ya existe');
    } else {
      throw new InternalServerErrorException(
        `Cant create  - Check server logs`,
      );
    }
  }
}
