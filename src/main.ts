import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{  
    rawBody: true
  }); 
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  app.enableCors();
  await app.listen(3001);
  console.log("Server listening on 3001")
}
bootstrap();