import {
  Controller,
  Get,
  Post,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/jwt-auth.guard";
import { StripeService } from "./payment.service";
import { AuthenticatedRequest } from "src/common/utils/common.types";

@Controller("payment")
export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCheckoutSession(
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<any> {
    return await this.stripeService.createCheckoutSession(currentUser);
  }

  @Post("webhook")
  webhook(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    return this.stripeService.webhook(req, res);
  }
  @Get("manage")
  @UseGuards(AuthGuard)
  managePlan(@Req() { currentUser }: AuthenticatedRequest) {
    return this.stripeService.managePlan(currentUser);
  }
}
