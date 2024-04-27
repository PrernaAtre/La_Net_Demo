import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(@Inject('STRIPE_API_KEY') private readonly apiKey: string) {
        this.stripe = new Stripe(this.apiKey, {
            apiVersion: '2024-04-10' // Use whatever API latest version
        });
    }

    async createCheckoutSession(userId: string, amount: string): Promise<any> {
        try {
            const session = await this.stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'T-shirt',
                            },
                            unit_amount: parseInt(amount), // Convert amount to integer
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: 'http://localhost:4242/success',
                cancel_url: 'http://localhost:4242/cancel',
            });
            console.log(session.url)
            return "shuhoi"

        } catch (error) {
            // Handle errors
            throw new Error('Error creating checkout session');
        }
    }

}
