import { DynamicModule, Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { StripeService } from './payment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema } from '../models/stripe.schema';
import { CommonService } from 'src/common/common.service';
import { UserSchema } from 'src/models/user.schema';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BcryptService } from 'src/common/bcrypt.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: 'Payment', schema: PaymentSchema },{
    name:"User",schema:UserSchema }]),AuthModule],
  providers: [StripeService,CommonService],
  controllers: [PaymentController],
})


export class PaymentModule {
 
}
