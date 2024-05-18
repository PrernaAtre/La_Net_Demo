import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Types } from "mongoose";
import { CommonService } from "src/common/common.service";

import { ServerError } from "src/common/utils/serverError";
import { User } from "src/models/user.schema";
import { CreatePageDto, UpdatePageDto } from "./dto/CreatePage.dto";
import { CurrentUser } from "src/common/utils/common.types";
import { NotificationsGateway } from "src/notifications/notifications.gateway";
import { Page } from "src/models/Page.schema";
import { Notification } from "src/models/notification.schema";

@Injectable()
export class PageService {
  constructor(
    @InjectModel("Page")
    private pageModel: Model<Page>,
    @InjectModel("User") private userModel: Model<User>,
    @InjectModel("Notification")
    private notificationModel: Model<Notification>,
    public commonService: CommonService,
    private notificationGateway: NotificationsGateway
  ) { }
  
  async get(id: string, currentUser: CurrentUser): Promise<Page> {
    try {
      const userId = mongoose.Types.ObjectId.createFromHexString(
        currentUser.id
      );
      const page = await this.pageModel
        .findOne({
          $or: [
            { _id: id, userId: userId },
            { _id: id},
            { publishId: mongoose.Types.ObjectId.createFromHexString(id) },
          ],
        })
        .lean();

      if (!page)
        throw new ServerError({ message: "Page not found", code: 404 });
      console.log("page---", page);
      return page;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to fetch page."
      );
    }
  }

  async pages(currentUser: CurrentUser): Promise<Page[]> {
    try {
      const userId = mongoose.Types.ObjectId.createFromHexString(
        currentUser.id
      );

      const pages = await this.pageModel.find({
        userId: userId,
      });

      if (!pages)
        throw new ServerError({ message: "Pages not found", code: 404 });

      return pages;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to fetch pages."
      );
    }
  }

  async create(page: CreatePageDto, currentUser: CurrentUser) {
    try {
      return await this.pageModel.create(
        new this.pageModel({
          ...page,
          userId: mongoose.Types.ObjectId.createFromHexString(currentUser.id),
        })
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to create page."
      );
    }
  }

  async update(id: string, page: UpdatePageDto, currentUser: CurrentUser) {
    try {
      const userId = mongoose.Types.ObjectId.createFromHexString(currentUser.id);
      const existingPage = await this.pageModel
        .findOne({
          _id: id,
          $or: [{ userId }, { sharedUsers: { $in: [userId] } }],
        })
        .lean();

      if (!existingPage)
        throw new ServerError({ message: "Page not found", code: 404 });

      const updatedPage = await this.pageModel.findOneAndUpdate(
        { _id: id },
        { $set: { ...page } },
        { new: true }
      );

      return updatedPage;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to update page."
      );
    }
  }

  async makeTrashed(id: string, currentUser: CurrentUser) {
    try {
      const existingPage = await this.pageModel
        .findOne({
          _id: id,
          userId: mongoose.Types.ObjectId.createFromHexString(currentUser.id),
        })
        .lean();

      if (!existingPage)
        throw new ServerError({ message: "Page not found", code: 404 });

      const page = await this.pageModel.findOneAndUpdate(
        { _id: id },
        { $set: { isTrashed: true } },
        { new: true }
      );

      return page;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to trash page."
      );
    }
  }

  async delete(id: string, currentUser: CurrentUser) {
    try {
      const existingPage = await this.pageModel
        .findOne({
          _id: id,
          userId: mongoose.Types.ObjectId.createFromHexString(currentUser.id),
        })
        .lean();

      if (!existingPage)
        throw new ServerError({ message: "Page not found", code: 404 });

      const deletedPage = await this.pageModel.findOneAndDelete({ _id: id });

      return deletedPage;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to delete page."
      );
    }
  }

  async recover(id: string, currentUser: CurrentUser) {
    try {
      const existingPage = await this.pageModel
        .findOne({
          _id: id,
          userId: mongoose.Types.ObjectId.createFromHexString(currentUser.id),
        })
        .lean();

      if (!existingPage)
        throw new ServerError({ message: "Page not found", code: 404 });

      const page = await this.pageModel.findOneAndUpdate(
        { _id: id },
        { $set: { isTrashed: false } },
        { new: true }
      );

      return page;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to recover pages."
      );
    }
  }

  async sharePage(pageId: string, userId: string, url: string, currentUser: CurrentUser): Promise<any> {
    try {
      const page = await this.pageModel
        .findOne({
          _id: mongoose.Types.ObjectId.createFromHexString(pageId),
          userId: mongoose.Types.ObjectId.createFromHexString(currentUser.id),
          isTrashed: false,
        })
        .lean();
      console.log("page------", page);

      if (!page) {
        throw new ServerError({ message: "Page not found", code: 404 });
      }

      const userObjectId = mongoose.Types.ObjectId.createFromHexString(userId);
      const user = await this.userModel.findOne({ _id: userObjectId });
      console.log("user--------", user);

      if (!user) {
        throw new ServerError({ message: "User not found", code: 404 });
      }
      const senderUser = await this.userModel.findById(currentUser.id)
      const sendingData = {
        sender: currentUser.id,
        senderName : senderUser.username,
        receiver: `${user._id}`,
        message: url,
      }
      console.log("sending data------",sendingData);
      
      const data = await this.notificationModel.create(sendingData);
      console.log("daata========",data);
      
      this.notificationGateway.socket.emit(`${user._id}`, JSON.stringify(sendingData))
      
      // Log the processed data instead of updating the database
      console.log("Page to be shared:", {
        pageId,
        userId: user._id.toString(),
        email: user.email,
        url
      });

      return { message: "User validated successfully.", data: { pageId, userId: user._id.toString(), email: user.email, url } };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to share page to user."
      );
    }
  }

  async removeSharedUsers(pageId: string, userId: string, currentUser: CurrentUser) {
    try {
      const page = await this.pageModel
        .findOne({
          _id: pageId,
          userId: mongoose.Types.ObjectId.createFromHexString(currentUser.id),
          isTrashed: false,
        })
        .lean();

      if (!page)
        throw new ServerError({ message: "Page not found", code: 404 });

      const user = await this.userModel.find({
        _id: new Types.ObjectId(userId),
      });
      if (!user) {
        throw new ServerError({ message: "User were not found", code: 404 });
      }
      await this.pageModel.updateOne(
        { _id: pageId },
        { $pull: { sharedUsers: new Types.ObjectId(userId) } }
      );
      return { message: "User removed successfully" };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to remove shared user."
      );
    }
  }

  async publishPage(pageId: string, currentUser: CurrentUser) {
    try {
      const publishedPage = await this.pageModel.findOneAndUpdate(
        {
          _id: pageId,
          userId: mongoose.Types.ObjectId.createFromHexString(currentUser.id),
        },
        { $set: { publishId: new Types.ObjectId() } },
        { new: true }
      );
      return { message: "Page published successfully", data: publishedPage };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async unpublish(pageId: string, currentUser: CurrentUser) {
    try {
      const unpublishedPage = await this.pageModel.findOneAndUpdate(
        {
          _id: pageId,
          userId: mongoose.Types.ObjectId.createFromHexString(currentUser.id),
        },
        { $set: { publishId: null } },
        { new: true }
      );
      return {
        message: "Page unpublished successfully",
        data: unpublishedPage,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getSharedPages(currentUser: CurrentUser) {
    try {
      const userId = mongoose.Types.ObjectId.createFromHexString(
        currentUser.id
      );
      console.log("uid--------",currentUser.id)
      const pages = await this.notificationModel.find({receiver : currentUser.id});
      if (!pages)
        throw new ServerError({ message: "Pages not found", code: 404 });
      
      return pages;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to fetch pages."
      );
    }
  }
}
