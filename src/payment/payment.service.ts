import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommonService } from "src/common/common.service";
import { User } from "src/models/user.schema";
import Stripe from "stripe";
import { StripeWebhookEvent } from "./dto/stripe-webhook-event.dto";
import { ServerError } from "src/common/utils/serverError";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private readonly commonService: CommonService,
    @InjectModel("User") private userModel: Model<User>
  ) {}

  async createCheckoutSession(currentUser) {
    try {
      const user = await this.userModel.findOne({ _id: currentUser.id });

      if (user.IsSubscribed)
        throw new ServerError({
          message: "User already have a plan.",
          code: 400,
        });

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
console.log('session.url', session.url)
      return { url: session.url };
    } catch (error) {
      console.log("error", error);
      throw new Error("Error creating checkout session");
    }
  }

  async handleWebhookEvent(event: StripeWebhookEvent): Promise<any> {
    switch (event.type) {
      case "invoice.paid":
        const invoicePaid = event.data.object;
          const accountId = invoicePaid.subscription_details.metadata.accountId;
          const data = await this.userModel
            .findOne({ _id: accountId }, { _id: 1 })
            .lean();

          if (!data) {
            return false;
          }

          await this.userModel.findOneAndUpdate(
            { _id: accountId },
            { IsSubscribed: true }
          );       

        break;

      case "subscription_schedule.canceled":
        const subscriptionScheduleCanceled = event.data.object;
        await this.userModel.updateOne(
          { userId: subscriptionScheduleCanceled.metadata.accountId },
          {
            $set: {IsSubscribed:false },
          }
        );
  
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
