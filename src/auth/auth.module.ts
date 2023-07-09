import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local-strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[PassportModule,PassportModule],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy],

})
export class AuthModule {}
