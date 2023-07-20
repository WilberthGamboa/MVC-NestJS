import { Injectable } from '@nestjs/common';
import { CreateMyPcDto } from './dto/create-my-pc.dto';
import { UpdateMyPcDto } from './dto/update-my-pc.dto';

@Injectable()
export class MyPcService {

    submitMyPc(formData: CreateMyPcDto){

    }

}
