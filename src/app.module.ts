import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundFilter } from './common/filters/notFoundFilter-exceptions.filter';
import { MyPcModule } from './my-pc/my-pc.module';
import { ServeStaticModule } from '@nestjs/serve-static';


@Module({
  imports: [
    
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB),
    AuthModule,
    MyPcModule,
    
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: NotFoundFilter,
    },],
})
export class AppModule {}
