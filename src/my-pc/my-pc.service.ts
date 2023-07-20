import { Injectable } from '@nestjs/common';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { UpdateMyPcDto } from './dto/update-my-pc.dto';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { MyPc } from './entities/my-pc.entity';

@Injectable()
export class MyPcService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        @InjectModel(MyPc.name)
        private readonly myPcModel: Model<MyPc>


    ){

    }

    submitMyPc(createMyPcDto: CreateMyPcDto){
        
    }

}
