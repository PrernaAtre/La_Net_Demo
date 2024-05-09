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

      throw new InternalServerErrorException(
        "Something went wrong while trying to process webhook event."
      );
    }
  }

  async createCheckoutSession(currentUser):Promise<object> {
    try {
      const user = await this.userModel.findOne({ _id: currentUser.id });

      if (user.IsSubscribed){
        throw new ServerError({
          code: 400,
          message: "User already have a plan.",
        });
      }

      if (!user.customerId) {
        const stripeCustomer = await this.commonService.createCustomer({
          email: user.email,
          name: user.username,
        });
        user.customerId = stripeCustomer.id;
        await user.save();
      }
      const session = await this.commonService.createCheckoutSession({
        customerId: user.customerId,
        userId: user.id,
      });
      console.log("session.url", session.url);
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
          { $set: { IsSubscribed: true } }
        );

        break;

      case "customer.subscription.deleted":
        const subscriptionScheduleCanceled = event.data.object;

        await this.userModel.updateOne(
          { _id: subscriptionScheduleCanceled.metadata.userId },
          {
            $set: { IsSubscribed: false },
          }
        );

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  async managePlan(currentUser){
    try {
      const user = await this.userModel.findOne({ _id: currentUser.id });

      if (!user.IsSubscribed){
        throw new ServerError({
          code: 400,
          message: "User has not taken plan.",
        });
      }

      const session = await this.stripe.billingPortal.sessions.create({
        customer: user.customerId,
        return_url: 'https://example.com/account',
      });
      return {url:session.url}
    } catch (error) {
      console.log('error', error)
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        "Something went wrong while trying to update the plan."
      );
  }
  }
}
