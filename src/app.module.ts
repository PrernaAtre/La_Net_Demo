import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { PageModule } from './page/page.module';
import { QuickNoteModule } from './quick-note/quick-note.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';
import { AuthGuard } from './auth/jwt-auth.guard';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/utils/errorHadler';

@Module({
  imports: [
    // CorsModule.forRoot({
    //   origin: '*', // Allow requests from any origin, you can specify specific origins if needed
    //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    //   allowedHeaders: 'Content-Type,Authorization', // Allow these headers
    // }),
    PaymentModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './images',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
    }),

     AuthModule, CloudinaryModule, QuickNoteModule, PageModule, PaymentModule, UserModule],
  controllers: [AppController, AuthController],
  providers: [AppService, CloudinaryService, AuthGuard],
})
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(CorsMiddleware).forRoutes('*');
  // }
}
