// PageService.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { Page } from './dto/Page.dto';
import { CreatePageDto } from './dto/CreatePage.dto';

@Injectable()
export class PageService {
    constructor(
        @InjectModel("Page")
        private pageModel: Model<Page>,
        @InjectModel('User') private userModel: Model<User>
    ) { }

    async addPage(pages: Array<{ id: string, type: string, content: string, children: Array<{ id: string, type: string, content: string }> }>, userId: string) {
        try {
            const user = await this.userModel.findOne({ _id: userId });
            if (!user) {
                console.log("User not found");
                return null; // Or throw an error, depending on your application logic
            }

            const newPage = new this.pageModel({ userId, data: pages });
            await newPage.save();
            return newPage;
        } catch (error) {
            console.error("Error adding pages:", error);
            throw error; // Rethrow the error to be handled by NestJS error handling
        }
    }

    async get(id: string) {
        try {
            const page = await this.pageModel.findById(id);

            if (!page) throw new Error("Page not found");

            return page;
        } catch (error) {
            throw new Error(`[Get Page] [${id}]: Error fetching page`);
        }
    }

    async pages(userId: string) {
        try {
            const pages = await this.pageModel.find({ userId });

            if (!pages) throw new Error("Pages not found");

            return pages;
        } catch (error) {
            throw new Error(`[Get Pages] [${userId}]: Error fetching pages`);
        }
    }

    async create(page: CreatePageDto) {
        try {
            const createdPage = await new this.pageModel(page).save();

            return createdPage;
        } catch (error) {
            throw new Error(`[Create Page] [${page._id}] [${page.userId}]: Error creating page`);
        }
    }

    async update(page: CreatePageDto) {
        try {

            console.log("page", page)

            const updatedPage = await this.pageModel.findByIdAndUpdate(page._id, page, { new: true });

            console.log("updatedPage", updatedPage)

            return updatedPage;
        } catch (error) {
            throw new Error(`[Update Page] [${page._id}] [${page.userId}]: Error updating page`);
        }
    }

    async makeTrashed(id: string) {
        try {
            const page = await this.pageModel.findByIdAndUpdate(id, { isTrashed: true }, { new: true });

            return page;
        } catch (error) {
            throw new Error(`[Make Trash Page] [${id}]: Error while deleting the page`);
        }
    }

    async delete(id: string) {
        try {
            const page = await this.pageModel.findByIdAndDelete(id);

            return page;
        } catch (error) {
            throw new Error(`[Delete Page] [${id}]: Error while deleting the page`);
        }
    }

    async recover(id: string) {
        try {
            const page = await this.pageModel.findByIdAndUpdate(id, { isTrashed: false }, { new: true });

            console.log("page recovered", page);

            return page;
        } catch (error) {
            throw new Error(`[Recover Page] [${id}]: Error while recovering the page`);
        }
    }
}