import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
        private readonly myPcModel: Model<MyPc>


    ){

    }

    async submitMyPc(createMyPcDto: CreateMyPcDto,user,fileName,fileDestination){

            let userEntity;
            const path = fileName ;
        try { 
            const id = new Types.ObjectId(user._id);
            userEntity ={
                ...createMyPcDto,
                user:id,
                image:path

            } 
           await  this.myPcModel.create(userEntity)

           
        } catch (error) {
            console.log (error)
            this.handleDbException(error)
        }
        return;
    }

    async getAll(user){
        console.log(user._id)
        const x = await this.myPcModel.find({user:new Types.ObjectId(user._id)}).lean()
        console.log(x)
        return x
    }


    private handleDbException(error:any){
        if (error.code===11000) {
          throw new BadRequestException('Ya existe ')
        }else{
          throw new InternalServerErrorException(`Cant create  - Check server logs`);
        }
      }
     
    getStaticProductImage(imageName:string){
        const path = join(__dirname,'../../uploads/', imageName);
        if (!existsSync(path)) {
            throw new BadRequestException('No se encontró la imagen: '+ imageName);
            
        }

    return path;
    } 

}
