import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { Payment } from './schema/stripe.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService,
        @InjectModel('Payment') private paymentModel: Model<Payment>,
    ) {
        this.stripe = new Stripe(this.configService.get('STRIPE_API_KEY'));
    }

    async createCheckoutSession(amount: string): Promise<string> {
        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Subscription',
                            },
                            unit_amount: parseInt(amount), // Convert amount to integer
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `http://localhost:3000/paymentSuccess?amount=${amount}`,
                cancel_url: 'http://localhost:3000/',
                billing_address_collection: 'auto',
            });
            console.log(session.url)

            return session.url;

        } catch (error) {
            throw new Error('Error creating checkout session');
        }
    }

    async storePayment(userId: string, username: string, email: string, amount: string): Promise<void> {
        console.log(userId,
            username,
            email,
            amount);

        const payment = new this.paymentModel({
            userId,
            username,
            email,
            amount
        });
        await payment.save();
    }


  async createPayment(paymentData: Payment): Promise<Payment> {
    try
    {
        const createdPayment = new this.paymentModel(paymentData);
        return createdPayment.save();
    }
    catch(err)
    {
        console.log(err);
        
    }
  }

  async getAllPaymentsByUserId(userId: string): Promise<Payment[]> {
    try
    {
        return this.paymentModel.find({ userId }).exec();
    }
    catch(err)
    {
        throw new Error('Error in fetching data');
    }
  }
}
