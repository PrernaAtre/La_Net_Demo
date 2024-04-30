import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response } from 'express';


@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) {}

    @Post('/payment/')
    async createCheckoutSession( @Body() body : any, @Res() res: Response)  {
        try
        {
            const { amount } = body;
            console.log(amount);
            const sessionUrl = await this.stripeService.createCheckoutSession(amount);
            console.log("sess--", sessionUrl)
            res.status(HttpStatus.OK).json({ sessionUrl });
        }
        catch(err)
        {
            console.log(err)
            //return err;
           res.status(HttpStatus.INTERNAL_SERVER_ERROR as number).json({ error: 'An error occurred' });
        }
    }


    @Post('/webhook')
    async handleWebhookEvent(@Body() eventPayload: any, @Res() res: Response) {
        console.log("eventPayload---",eventPayload);
        try {
            const eventType = eventPayload.type;
            const eventData = eventPayload.data.object;
            
            if (eventType === 'checkout.session.completed') {
                const { userId, username, email, amount } = eventData.metadata;
                await this.stripeService.storePayment(userId, username, email, amount);
            }

            res.sendStatus(HttpStatus.OK);
        } catch (error) {
            console.error('Error handling webhook event:', error);
            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
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
}
