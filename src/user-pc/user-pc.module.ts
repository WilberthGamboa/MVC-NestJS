import { Module } from '@nestjs/common';
import { UserPcService } from './user-pc.service';
import { UserPcController } from './user-pc.controller';

@Module({
  controllers: [UserPcController],
  providers: [UserPcService]
})
export class UserPcModule {}
