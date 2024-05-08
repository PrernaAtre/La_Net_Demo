import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/models/user.schema';
import Stripe from 'stripe';
import { Payment } from '../models/stripe.schema';
import { StripeWebhookEvent } from './dto/stripe-webhook-event.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService,
    @InjectModel('Payment') private paymentModel: Model<Payment>,
    private readonly commonService: CommonService,
    @InjectModel('User') private userModel: Model<User>
  ) { }

  async createCheckoutSession(currentUser): Promise<string> {
    try {
      const user = await this.userModel.findOne({ _id: currentUser.id })

      //TODO check if user do not have existing plan
      if (user.IsSubscribed) throw new Error('User already have a plan');

      const session = await this.commonService.createCheckoutSession({ customerId: user.customerId, userId: user.id })

      if (session.url) {
        await this.userModel.updateOne({ _id: user._id }, { $set: { IsSubscribed: true } });
      }

      return session.url;

    } catch (error) {
      console.log('error', error)
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
    try {
      const createdPayment = new this.paymentModel(paymentData);

      await this.userModel.updateOne({ _id: paymentData.userId }, { $set: { IsSubscribed: true } });

      return createdPayment.save();
    }
    catch (err) {
      console.log(err);

    }
  }

  async updatePayment(paymentData: Partial<Payment>): Promise<void> {
    try {

      await this.paymentModel.findOneAndUpdate({ stripeSubscriptionId: paymentData.stripeSubscriptionId },
        { $set: { stripePriceId: paymentData.stripePriceId, stripeCurrentPeriodEnd: paymentData.stripeCurrentPeriodEnd } },
        { new: true }
      );

    } catch (err) {
      console.log(err);
    }
  }

  async getAllPaymentsByUserId(userId: string): Promise<Payment[]> {
    try {
      return this.paymentModel.find({ userId })
    }
    catch (err) {
      throw new Error('Error in fetching data');
    }
  }

  async handleWebhookEvent(event: StripeWebhookEvent): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;

        const subscription = await this.stripe.subscriptions.retrieve(session.subscription.toString());

        const paymentData: Payment = {
          userId: session.customer ? session.customer.toString() : '', // convert customer to string
          username: session.customer_details?.name,
          email: session.customer_email,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          stripeCustomerId: session.customer.toString(),
          stripePriceId: subscription.items.data[0].price.id,
          stripeSubscriptionId: subscription.id,
        };
        const createdPayment = this.createPayment(paymentData);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;

        const paymentData1: Partial<Payment> = {
          stripePriceId: invoice.lines.data[0].price.id,
          stripeSubscriptionId: subscription.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        };
        const createdPayment1 = this.updatePayment(paymentData1);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
