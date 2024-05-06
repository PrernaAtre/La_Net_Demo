import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { DocumentModule } from './document/document.module';
// import { CorsModule } from '@nestjs/platform-express'; // Import from @nestjs/platform-express
import { PageModule } from './page/page.module';
import { DocumentController } from './document/document.controller';
import { QuickNoteModule } from './quick-note/quick-note.module';
import { ShareDocumentModule } from './share-document/share-document.module';
import { StripeModule } from './stripe/stripe.module';
import { EmailService } from './auth/email.service';


// db connection
const username = "prernaatre";
const password = "Shinchan";
const databaseName = 'user_auth';
const DBURL: string = `mongodb+srv://${username}:${password}@cluster0.89cuca2.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;

@Module({
  imports: [
    // CorsModule.forRoot({
    //   origin: '*', // Allow requests from any origin, you can specify specific origins if needed
    //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    //   allowedHeaders: 'Content-Type,Authorization', // Allow these headers
    // }),
    // StripeModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './images',
    }),
    MongooseModule.forRoot(DBURL), AuthModule, CloudinaryModule, DocumentModule, ShareDocumentModule, QuickNoteModule, PageModule, StripeModule],
  controllers: [AppController, AuthController, DocumentController,],
  providers: [AppService, CloudinaryService, EmailService,],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(CorsMiddleware).forRoutes('*');
  // }
}
