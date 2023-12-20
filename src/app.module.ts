import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundFilter } from './common/filters/notFoundFilter-exceptions.filter';
import { MyPcModule } from './my-pc/my-pc.module';
import { MyPc, MyPcSchema } from './my-pc/entities/my-pc.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB),
    AuthModule,
    MyPcModule,
    MongooseModule.forFeature([
      {
        name: MyPc.name,
        schema: MyPcSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: NotFoundFilter,
    },
  ],
})
export class AppModule {}
