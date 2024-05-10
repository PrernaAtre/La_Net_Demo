// PageService.ts
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
import { Page } from "../models/Page.schema";
import {
  CreatePageDto,
  UpdatePageDto
} from "./dto/CreatePage.dto";

@Injectable()
export class PageService {
  constructor(
    @InjectModel("Page")
    private pageModel: Model<Page>,
    @InjectModel("User") private userModel: Model<User>,
    public commonService: CommonService
  ) {}

  async get(id: string, currentUser): Promise<Page> {
    try {
      const userId = mongoose.Types.ObjectId.createFromHexString(
        currentUser.id
      );
      const page = await this.pageModel
        .findOne({
          $or: [
            { _id: id, userId: userId },
            { _id: id, sharedUsers: { $in: [userId] } },
            { publishId: mongoose.Types.ObjectId.createFromHexString(id) },
          ],
        })
        .lean();

      if (!page)
        throw new ServerError({ message: "Page not found", code: 404 });

      return page;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to fetch page."
      );
    }
  }

  async pages(currentUser): Promise<Page[]> {
    try {
      const userId = mongoose.Types.ObjectId.createFromHexString(
        currentUser.id
      );

      const pages = await this.pageModel.find({
        $or: [{ userId: userId }, { sharedUsers: { $in: [userId] } }],
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

  async create(page: CreatePageDto, currentUser) {
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

  async update(id: string, page: UpdatePageDto, currentUser) {
    try {
      const existingPage = await this.pageModel
        .findOne({
          _id: id,
          userId: mongoose.Types.ObjectId.createFromHexString(currentUser.id),
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

  async makeTrashed(id: string, currentUser) {
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

  async delete(id: string, currentUser) {
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

  async recover(id: string, currentUser) {
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

  async addSharedUsers(pageId, userIds, currentUser) {
    try {

      const page = await this.pageModel
        .findOne({
          _id: mongoose.Types.ObjectId.createFromHexString(pageId),
          userId: mongoose.Types.ObjectId.createFromHexString(currentUser.id),
          isTrashed: false,
        })
        .lean();

      if (!page)
        throw new ServerError({ message: "Page not found", code: 404 });

      const userObjectIds = userIds.map((userId) =>
        mongoose.Types.ObjectId.createFromHexString(userId)
      );
      const users = await this.userModel.find({ _id: { $in: userObjectIds } });
      if (users.length !== userIds.length) {
        throw new ServerError({
          message: "Some users were not found",
          code: 404,
        });
      }
      const data = await this.pageModel.findOneAndUpdate(
        { _id: pageId },
        { $set: { sharedUsers: userObjectIds } },
        {
          new: true,
        }
      );
      return { message: "User added successfully.", data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log("error", error);
      throw new InternalServerErrorException(
        "Something went wrong while trying to share page to user."
      );
    }
  }

  async removeSharedUsers(pageId: string, userId: string, currentUser) {
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

  async publishPage(pageId: string, currentUser) {
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

  async unpublish(pageId: string, currentUser) {
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
}
