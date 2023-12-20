import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MyPc } from './my-pc/entities/my-pc.entity';
import { Model } from 'mongoose';
import { ISessionUser } from './common/interfaces/IRequestUser.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    constructor(
       
        @InjectModel(MyPc.name)
        private readonly myPcModel: Model<MyPc>,
        private configService: ConfigService
        
      ) {}
    async getAllMyPc( id: number) {
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
          .find()
          .lean()
          .limit(limit)
          .skip((id - 1) * 3);
        const nextPcs = await this.myPcModel
          .find()
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
}
