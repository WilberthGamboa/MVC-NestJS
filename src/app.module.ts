import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserPcModule } from './user-pc/user-pc.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserPcModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
