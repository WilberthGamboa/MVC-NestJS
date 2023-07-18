import { Module } from '@nestjs/common';
import { MyPcService } from './my-pc.service';
import { MyPcController } from './my-pc.controller';

@Module({
  controllers: [MyPcController],
  providers: [MyPcService]
})
export class MyPcModule {}
