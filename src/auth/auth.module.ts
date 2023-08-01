import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local-strategy';
import { SessionSerializer } from './serializer/session.serializer';
import { ErrorsFilter } from './helper/errorsFilter.helper';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer, ErrorsFilter],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    PassportModule,
  ],
  exports: [MongooseModule],
})
export class AuthModule {}
