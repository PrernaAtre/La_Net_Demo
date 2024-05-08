import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { StripeService } from './payment.service';
import { Response } from 'express';
import Stripe from 'stripe';
import { CommonService } from 'src/common/common.service';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/auth.controller';
import { StripeWebhookEvent } from './dto/stripe-webhook-event.dto';
import { StripeWebhookGuard } from './stripe-webhook.guard';


@Controller('payment')
export class PaymentController {
  constructor(private readonly stripeService: StripeService) { }

  @Post()
  @UseGuards(AuthGuard)
  async createCheckoutSession(@Req() { currentUser }: AuthenticatedRequest,@Res() res: Response) {
    try {
      return await this.stripeService.createCheckoutSession(currentUser)
    }
    catch (err) {
      console.log(err)
      //return err;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR as number).json({ error: 'An error occurred' });
    }
  }


  @Post('/webhook') //not working
  @UseGuards(StripeWebhookGuard)
  async handleWebhookEvent(@Body() event: StripeWebhookEvent): Promise<void> {
    await this.stripeService.handleWebhookEvent(event);
  }

  // @Post() // not working
  // async handlePaymentWebhook(@Body() payload: Stripe.Event) {
  //   try {
  //     console.log("payload------", payload);

  //     if (payload.type === 'checkout.session.completed') {
  //       const session = payload.data.object as Stripe.Checkout.Session;
  //       const paymentData: Payment = {
  //         userId: session.customer ? session.customer.toString() : '', // convert customer to string
  //         username: session.customer_details?.name,
  //         email: session.customer_email,
  //         amount: String(session.amount_total / 100), // Convert to decimal
  //       };
  //       const createdPayment = this.stripeService.createPayment(paymentData);
  //     }
  //   }
  //   catch (err) {
  //     console.log("err----", err);
  //   }
  // }

}
