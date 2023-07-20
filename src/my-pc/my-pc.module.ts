import { Module } from '@nestjs/common';
import { MyPcService } from './my-pc.service';
import { MyPcController } from './my-pc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MyPc, MyPcSchema } from './entities/my-pc.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MyPcController],
  providers: [MyPcService],
  imports:[
    MongooseModule.forFeature([
      {
        name:MyPc.name,
        schema:MyPcSchema
      }
     
    ]),
    AuthModule
  ]
})
export class MyPcModule {}
