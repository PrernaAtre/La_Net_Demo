import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { DocumentModule } from './document/document.module';
// import { CorsModule } from '@nestjs/platform-express'; // Import from @nestjs/platform-express
import { DocumentController } from './document/document.controller';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ShareDocumentModule } from './share-document/share-document.module';
import { ShareDocumentService } from './share-document/share-document.service';
import { ShareDocumentController } from './share-document/share-document.controller';
import { QuickNoteModule } from './quick-note/quick-note.module';
import { BlockModule } from './block/block.module';
import { StripeModule } from './stripe/stripe.module';


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

    ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
  MulterModule.register({
    dest : './images',
  }),
    MongooseModule.forRoot(DBURL), AuthModule, CloudinaryModule, DocumentModule, ShareDocumentModule, QuickNoteModule, BlockModule, StripeModule],
  controllers: [AppController, AuthController, DocumentController, ],
  providers: [AppService, CloudinaryService, ],
})
export class AppModule{
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(CorsMiddleware).forRoutes('*');
  // }
}
