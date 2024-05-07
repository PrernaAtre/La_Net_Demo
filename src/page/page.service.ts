// PageService.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/models/user.schema';
import { Page } from '../models/Page.schema';
import { CreatePageDto, UpdatePageDto } from './dto/CreatePage.dto';

@Injectable()
export class PageService {
    constructor(
        @InjectModel("Page")
        private pageModel: Model<Page>,
        @InjectModel('User') private userModel: Model<User>
    ) { }

    async get(id: string,currentUser): Promise<Page>  {
        try {
            const page = await this.pageModel.findOne({ _id: id, $or: [
                { userId: currentUser.id }, 
                { sharedUsers: { $in: [currentUser.id] } } 
            ]});

            if (!page) throw new Error("Page not found");

            return page;
        } catch (error) {
            console.log('get::> error', error)
            throw new Error(`Failed to fetch the page with ID ${id}`);
        }
    }

    async pages(currentUser): Promise<Page[]> {
        try {
            const pages = await this.pageModel.find({  $or: [
                { userId: currentUser.id }, 
                { sharedUsers: { $in: [currentUser.id] } } 
            ] });

            if (!pages) throw new Error("Pages not found");

            return pages;
        } catch (error) {
            throw new Error(`Failed to fetch pages for user with ID ${currentUser.id}`);
        }
    }

    async create(page: CreatePageDto,currentUser) {
        try {
            const createdPage = await this.pageModel.create(new this.pageModel({...page,userId:currentUser.id}));

            return createdPage;
        } catch (error) {
            throw new Error(`Failed to create a new page`);
        }
    }

    async update(id:string,page: UpdatePageDto,currentUser) {
        try {
            const existingPage = await this.pageModel.findOne({ _id: id, userId: currentUser.id });

            if (!existingPage) {
                throw new Error(`Page with id ${id} not found for the current user`);
            }
    
            const updatedPage = await this.pageModel.findOneAndUpdate({ _id: id }, { $set: {...page} }, { new: true });
    
            return updatedPage;
        } catch (error) {
            throw new Error(`Failed to update the page with ID ${id}`);
        }
    }

    async makeTrashed(id: string,currentUser) {
        try {
            const existingPage = await this.pageModel.findOne({ _id: id, userId: currentUser.id });

            if (!existingPage) {
                throw new Error(`Page with ID ${id} not found for the current user`);
            }
    
            const page = await this.pageModel.findOneAndUpdate({ _id: id },{$set: { isTrashed: true }}, { new: true });
    
            return page;
            } catch (error) {
                throw new Error(`Failed to move the page with ID ${id} to trash`);
            }
    }

    async delete(id: string,currentUser) {
        try {
            const existingPage = await this.pageModel.findOne({ _id: id, userId: currentUser.id });

            if (!existingPage) {
                throw new Error(`Page with ID ${id} not found for the current user`);
            }
    
            const deletedPage = await this.pageModel.findOneAndDelete({ _id: id });
    
            return deletedPage;
            } catch (error) {
                throw new Error(`Failed to delete the page with ID ${id}`);
            }
    }

    async recover(id: string,currentUser) {
        try {
            const existingPage = await this.pageModel.findOne({ _id: id, userId: currentUser.id });

            if (!existingPage) {
                throw new Error(`Page with id ${id} not found for the current user`);
            }
    
            const page = await this.pageModel.findOneAndUpdate({ _id: id },{$set: { isTrashed: false }}, { new: true });
    
            return page;
        } catch (error) {
            throw new Error(`Failed to recover the page with ID ${id}`);
        }
    }

    async addSharedUsers(userIds:Array<string>,pageId:string,currentUser):Promise<string>{
        try {
            if(!userIds.length){
                throw new Error("Invalid user id");
            }
            const page = await this.pageModel.findOne({_id:pageId,userId:currentUser.id}, { isTrashed: false }, { new: true });
            
            if(!page){
                throw new Error("Page not found");
            }
            
            const userObjectIds=userIds.map((userId)=>new Types.ObjectId(userId))

            const users = await this.userModel.find({_id:{$in:userObjectIds}}, { isTrashed: false }, { new: true });
            if(users.length!==userIds.length){
                throw new Error("Some users were not found")
            }
            await this.pageModel.updateOne({_id:pageId},{$set:{sharedUsers:userObjectIds}})
            return "success";
        } catch (error) {
            throw new Error(`Failed to add shared users to the page`);
        }   
    }

    async removeSharedUsers(userId:string,pageId:string,currentUser):Promise<string>{
        try {
            const page = await this.pageModel.findOne({_id:pageId,userId:currentUser.id}, { isTrashed: false }, { new: true });
            
            if(!page){
                throw new Error("Page not found");
            }
            
            const user = await this.userModel.find({_id:new Types.ObjectId(userId)});
            if(!user){
                throw new Error("user were not found")
            }
            await this.pageModel.updateOne({_id:pageId},{$pull:{sharedUsers:new Types.ObjectId(userId)}})
            return "success";
        } catch (error) {
            throw new Error(`Failed to remove shared user from the page`);
        }   
    }
}
