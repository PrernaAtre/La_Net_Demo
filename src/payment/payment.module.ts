import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { StripeService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';
import { UserSchema } from 'src/models/user.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{
    name:"User",schema:UserSchema }]),AuthModule],
  providers: [StripeService,CommonService],
  controllers: [PaymentController],
})


export class PaymentModule {
 
}
