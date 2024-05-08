import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
// import  *  as stripe from "stripe";

@Injectable()
export class CommonService {

  constructor(private readonly configService: ConfigService) { }

  private stripeClient = new Stripe(this.configService.get<string>('STRIPE_API_KEY'));

  createCustomer({ email, name }) {
    return this.stripeClient.customers.create({
      name,
      email,
    });
  }

  createCheckoutSession({ customerId, userId }) {
    return this.stripeClient.checkout.sessions.create({
      success_url: this.configService.get<string>('FRONTEND_URL'),
      line_items: [{ price: this.configService.get<string>('PRICE_ID'), quantity: 1 }],
      mode: "subscription",
      currency: "USD",
      client_reference_id: customerId,
      customer: customerId,
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });
  };

  // webhookHandler(payload: any, sig: string) {
  //   try {
  //     const event = this.stripeClient.webhooks.constructEvent(payload, sig, endpointSecret);
  //     return event;
  //   } catch (err) {
  //     throw new Error(`Webhook Error: ${err.message}`);
  //   }

  // }





}
