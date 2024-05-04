import { DynamicModule, Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema } from './schema/stripe.schema';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: 'Payment', schema: PaymentSchema }]),],
  providers: [StripeService],
  controllers: [StripeController],
})


export class StripeModule {
 
}
