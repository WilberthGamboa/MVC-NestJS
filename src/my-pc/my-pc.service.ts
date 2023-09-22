import * as fs from 'fs';
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
import { fileNamer } from './helper/fileNamer.helper';
import { saveImgDisk } from './helper/saveImgDisk.helper';

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
    user:any
  ) {
    //TODO: Almacenar la imagen en disco
    const fileNameUuid = fileNamer(createMyPcDto.file.extension);
    saveImgDisk(createMyPcDto.file,fileNameUuid);

    try {
      const id = new Types.ObjectId(user._id);
     const userEntity = {
        ...createMyPcDto,
        user: id,
        image: fileNameUuid,
      };
      await this.myPcModel.create(userEntity);
    } catch (error) {
      console.log(error);
      this.handleDbException(error);
    }
   
  }

  async getAll(user, id:number) {
    const limit = 3; 
    let isEnabledBtnPreviousPage = true;
    let isEnabledBtnNextPage = true;
    const pagination = {
      currentPage:id,
      nextPage:id+1,
      previousPage:id-1
    }

    // Obtenemos las pc
    const pcs = await this.myPcModel
      .find({ user: new Types.ObjectId(user._id) })
      .lean()
      .limit(limit)
      .skip((id - 1)*3);
    const nextPcs = await this.myPcModel
      .find({ user: new Types.ObjectId(user._id) })
      .lean()
      .limit(limit)
      .skip(id*3);

    //Desactivamos los botones

    if (id === 1) {
      isEnabledBtnPreviousPage = false;
    }

    if (nextPcs.length === 0) {
      isEnabledBtnNextPage = false;
    }

    // Agregamos la url de las fotos
    const pcsWithUrlImage = pcs.map((pc) => {
      // console.log(x)
      const { image,_id, ...restoPc } = pc;
      const urlImage = 'http://localhost:3000/myPc/see/' + image;
      const urlEditPc = 'http://localhost:3000/myPc/edit/'+_id;
      const urlDelete = 'http://localhost:3000/myPc/delete/'+_id;
      // console.log(nuevaImagen)
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
     pagination
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
  async findMyPc(id:string,user){
    try {
    const pc =  await this.myPcModel.findById(id);
    if (pc.user.toString()!=user._id) {
      throw new BadRequestException('La computadora no le pertenece');
      
    }

    return pc;
    } catch (error) {
      console.log(error)
    }

  }
  async updateMyPc(id: string, user, updateMyPcDto: UpdateMyPcDto) {
    let updateTemporal = {
      
    }
    updateTemporal = {
      ...updateMyPcDto
    }
    const pc = await this.findMyPc(id, user);
    if (pc) {
      if (updateMyPcDto.file) {
       
        const filePath = join(__dirname,'..','..','..','uploads',pc.image);

    

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error al eliminar el archivo:', err);
          } else {
            console.log('Archivo eliminado exitosamente.');
          }
        });
        const fileNameUuid = fileNamer(updateMyPcDto.file.extension);
        saveImgDisk(updateMyPcDto.file,fileNameUuid);
        
        updateTemporal = {
          ...updateMyPcDto,
          image: fileNameUuid,
        }

    }
    await this.myPcModel.findByIdAndUpdate(pc.id,updateTemporal);
   }

  }
  async deleteMyPc(id, user){
    const pc = await this.findMyPc(id, user);
    console.log(pc)
    await this.myPcModel.deleteOne(pc._id)
  }
}
