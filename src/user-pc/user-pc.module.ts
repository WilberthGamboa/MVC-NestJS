import { Module } from '@nestjs/common';
import { UserPcService } from './user-pc.service';
import { UserPcController } from './user-pc.controller';
import { LocalStrategy } from '../auth/strategy/local-strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserPcController],
  providers: [UserPcService],
  imports:[AuthModule]
})
export class UserPcModule {}
