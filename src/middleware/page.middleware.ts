import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { AuthenticatedRequest } from 'src/auth/auth.controller';
import { CommonService } from 'src/common/common.service';
import { Page } from 'src/models/Page.schema';
 
@Injectable()
export class CheckPublishLimitMiddleware implements NestMiddleware {
  constructor(@InjectModel("Page")  private pageModel: Model<Page>,
   private readonly commonService: CommonService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const pageId = req.params.id; 

    try {
      const currentUser = req.currentUser; 

      const page = await this.pageModel.findOne({ _id: pageId, userId: currentUser.id, isTrashed: false });

      if (!page) {
        throw new Error("Page not found");
      }

      const publishedPageCount = await this.pageModel.countDocuments({ userId: currentUser.id, publishId: { $ne: null }, isTrashed: false });

      const publishablePostCount = this.commonService.publishablePostCount; 

      if (publishedPageCount >= publishablePostCount) {
        throw new Error("You exceeded the free publish limit.");
      }

      next();
    } catch (error) {
      throw new HttpException(error?.message || 'Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
