import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { StripeService } from './payment.service';
import { Response } from 'express';
import Stripe from 'stripe';
import { Payment } from '../models/stripe.schema';
import { CommonService } from 'src/common/common.service';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/auth.controller';


@Controller('payment')
export class PaymentController {
    constructor(private readonly stripeService: StripeService) { }

    @Post()
    @UseGuards(AuthGuard)
    async createCheckoutSession(@Body() body: any, @Res() res: Response,@Req() { currentUser }: AuthenticatedRequest) {
        try {

            return this.stripeService.createCheckoutSession(currentUser)
        }
        catch (err) {
            console.log(err)
            //return err;
            res.status(HttpStatus.INTERNAL_SERVER_ERROR as number).json({ error: 'An error occurred' });
        }
    }


    @Post('/webhook') //not working
    async handleWebhookEvent(@Body() eventPayload: any, @Res() res: Response) {
        console.log("eventPayload---", eventPayload);
        const endpointSecret = "whsec_203431f7af31d28597c77aee8eeda1ffa6643a6bd3d33444b491af9125fea0de";

        try {
            // const sig = req.headers['stripe-signature'];

            // let event;
          
            // try {
            //   event =.webhooks.constructEvent(req.body, sig, endpointSecret);
            // } catch (err) {
            //   response.status(400).send(`Webhook Error: ${err.message}`);
            //   return;
            // }
          
            // // Handle the event
            // switch (event.type) {
            //   case 'customer.subscription.deleted':
            //     const customerSubscriptionDeleted = event.data.object;
            //     // Then define and call a function to handle the event customer.subscription.deleted
            //     break;
            //   case 'invoice.paid':
            //     const invoicePaid = event.data.object;
            //     // Then define and call a function to handle the event invoice.paid
            //     break;
            //   // ... handle other event types
            //   default:
            //     console.log(`Unhandled event type ${event.type}`);
            // }
          
            // // Return a 200 response to acknowledge receipt of the event
            // res.send();
            //           if (eventType === 'checkout.session.completed') {
            //     const { userId, username, email, amount } = eventData.metadata;
            //     await this.stripeService.storePayment(userId, username, email, amount);
            // }

            res.sendStatus(HttpStatus.OK);
        } catch (error) {
            console.error('Error handling webhook event:', error);
            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post() // not working
    async handlePaymentWebhook(@Body() payload: Stripe.Event) {
        try
        {
            console.log("payload------",payload);
        
            if (payload.type === 'checkout.session.completed') {
              const session = payload.data.object as Stripe.Checkout.Session;
              const paymentData: Payment = {
                userId: session.customer ? session.customer.toString() : '', // convert customer to string
                username: session.customer_details?.name,
                email: session.customer_email,
                amount: String(session.amount_total / 100), // Convert to decimal
              };
              const createdPayment = this.stripeService.createPayment(paymentData);
            }
        }
        catch(err)
        {
            console.log("err----", err);          
        }
    }

    @Post('/storePayment')
    async storePayment(
        @Body() paymentData: { userId: string, username: string, email: string, amount: string }
    ): Promise<void> {
        try {
            // Extract data from paymentData object
            const { userId, username, email, amount } = paymentData;

            // Call the storePayment method of the StripeService
            await this.stripeService.storePayment(userId, username, email, amount);
        } catch (error) {
            throw new Error('Error storing payment');
        }
    }

    @Get(':userId')
    async getAllPaymentsByUserId(@Param('userId') userId: string): Promise<Payment[]> {
        try
        {
            return this.stripeService.getAllPaymentsByUserId(userId);
        }
        catch(err)
        {
            console.log('err', err)
            throw new Error('Error in fetching data');
        }
    }
}
