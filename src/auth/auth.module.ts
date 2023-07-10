import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local-strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

@Module({
  imports:[PassportModule],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,SessionSerializer],


})
export class AuthModule {}
