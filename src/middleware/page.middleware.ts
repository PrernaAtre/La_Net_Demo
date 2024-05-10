import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { AuthenticatedRequest } from 'src/common/utils/common.types';
import { ServerError } from 'src/common/utils/serverError';
import { Page } from 'src/models/Page.schema';
import { User } from 'src/models/user.schema';
 
@Injectable()
export class CheckPublishLimitMiddleware implements NestMiddleware {
  constructor(@InjectModel("Page")  private pageModel: Model<Page>,
  @InjectModel(User.name) private userModel: Model<User>,
   private readonly commonService: CommonService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const pageId = req.params.id; 

    try {
      const currentUser = req.currentUser; 
      const userId= mongoose.Types.ObjectId.createFromHexString(currentUser.id);

      const user =await this.userModel.findOne({_id:userId}).lean()
      if(user.IsSubscribed){
        return next()
      }
      const page = await this.pageModel.findOne({ _id: pageId, userId, isTrashed: false }).lean();

      if (!page) throw new ServerError({ message: "Page not found", code: 404 });

      const publishedPageCount = await this.pageModel.countDocuments({ userId, publishId: { $ne: null }, isTrashed: false });

      const publishablePostCount = this.commonService.publishablePostCount; 

      if (publishedPageCount >= publishablePostCount) {
        throw new ServerError({ message: "You exceeded the free publish limit.", code: 400 });
      }

      next();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to trash page."
      );
    }
  }
}
