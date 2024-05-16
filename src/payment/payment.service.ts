import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  RawBodyRequest,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommonService } from "src/common/common.service";
import { User } from "src/models/user.schema";
import Stripe from "stripe";
import { StripeWebhookEvent } from "./dto/stripe-webhook-event.dto";
import { ServerError } from "src/common/utils/serverError";
import { Request, Response } from "express";
import { CurrentUser } from "src/common/utils/common.types";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private readonly commonService: CommonService,
    @InjectModel("User") private userModel: Model<User>
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY);
  }

  async webhook(req: RawBodyRequest<Request>, res: Response) {
    const signature = req.headers["stripe-signature"];

    try {
      const event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (!event) {
        throw new ServerError({ code: 400, message: "Invalid Stripe event." });
      }
      if (
        event.type === "invoice.paid" ||
        event.type === "customer.subscription.deleted"
      ) {
        return await this.handleWebhookEvent(event);
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
console.log('error', error)
      throw new InternalServerErrorException(
        "Something went wrong while trying to process webhook event."
      );
    }
  }

  async createCheckoutSession(currentUser:CurrentUser):Promise<object> {
    try {
      const user = await this.userModel.findOne({ _id: currentUser.id });

      if (user.isSubscribed){
        throw new ServerError({
          code: 400,
          message: "User already have a plan.",
        });
      }

      if (!user.customerId) {
        const stripeCustomer = await this.stripe.customers.create({
          email: user.email,
          name: user.username,
        });
        user.customerId = stripeCustomer.id;
        await user.save();
      }
      const session = await  this.stripe.checkout.sessions.create({
        success_url: this.configService.get<string>('FRONTEND_URL'),
        line_items: [{ price: this.configService.get<string>('PRICE_ID'), quantity: 1 }],
        mode: "subscription",
        currency: "INR",
        client_reference_id: user.customerId,
        customer: user.customerId,
        billing_address_collection:"required",
        subscription_data: {
          metadata: {
            userId: user.id,
          },
        },
      });
      return { url: session.url };
    } catch (error) {
      console.log('error', error)
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Something went wrong while trying to create checkout session."
      );
  }
  }

  async handleWebhookEvent(event: StripeWebhookEvent): Promise<any> {
    switch (event.type) {
      case "invoice.paid":
        const invoicePaid = event.data.object;
        const userId = invoicePaid.subscription_details.metadata.userId;
        const data = await this.userModel
          .findOne({ _id: userId }, { _id: 1 })
          .lean();

        if (!data) {
          return false;
        }
        await this.userModel.updateOne(
          { _id: userId },
          { $set: { isSubscribed: true } }
        );

        break;

      case "customer.subscription.deleted":
        const subscriptionScheduleCanceled = event.data.object;

        await this.userModel.updateOne(
          { _id: subscriptionScheduleCanceled.metadata.userId },
          {
            $set: { isSubscribed: false },
          }
        );

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  async managePlan(currentUser:CurrentUser){
    try {
      const user = await this.userModel.findOne({ _id: currentUser.id }).lean();
      console.log("user-------",user);

      if (!user.isSubscribed){
        throw new ServerError({
          code: 400,
          message: "User has not taken plan.",
        });
      }

      const session = await this.stripe.billingPortal.sessions.create({
        customer: user.customerId,
        return_url: this.configService.get<string>('FRONTEND_URL'),
      });

      return {url:session.url, isSubscribed: user.isSubscribed}
    } catch (error) {
      console.log('error', error)
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Something went wrong while trying to update the plan."
      );
  }
  }
}
