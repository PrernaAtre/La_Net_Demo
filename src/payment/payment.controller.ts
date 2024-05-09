import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { StripeService } from "./payment.service";
import Stripe from "stripe";
import { CommonService } from "src/common/common.service";
import { AuthGuard } from "src/auth/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/auth.controller";
import { Request, Response } from "express";

@Controller("payment")
export class PaymentController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly commonService: CommonService
  ) {}

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
  @Put("manage")
  @UseGuards(AuthGuard)
  managePlan(@Req() { currentUser }: AuthenticatedRequest) {
    return this.stripeService.managePlan(currentUser);
  }

  
}
