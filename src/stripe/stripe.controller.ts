import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

    @Post('/payment/:userId')
    async createCheckoutSession(@Param('userId') userId : string, @Body('amount') amount : string, @Res() res: Response) {
        console.log(userId, amount)
        return this.stripeService.createCheckoutSession(userId, amount);
    }
}
