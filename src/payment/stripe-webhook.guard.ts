import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';
import Stripe from 'stripe';

@Injectable()
export class StripeWebhookGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['stripe-signature'];
    const body = request.rawBody;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // Replace with your Stripe webhook secret

    let event;

    try {
      event = this.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`❌ Error verifying webhook signature: ${err.message}`);
      return false;
    }

    // Handle the event
    console.log(`✅ Received event: ${event.type}`);

    // Return true to allow the request to proceed
    return true;
  }

  private constructEvent(
    body: string | Buffer,
    signature: string,
    webhookSecret: string,
  ): Stripe.Event {
    const events = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== events) {
      throw new Error('Webhook signature mismatch');
    }

    const data = JSON.parse(body.toString());

    return {
      id: data.id,
      type: data.type,
      data: {
        object: data.data.object,
      },
    } as Stripe.Event;
  }
}