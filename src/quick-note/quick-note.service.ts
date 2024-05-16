import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuickNote } from './quickNote.schema';
import mongoose, { Model } from 'mongoose';
import { CreateQuickNoteDto, UpdateQuickNoteDto } from './dto/quickNote.dto';
import OpenAI from "openai";
// import { OpenAIApi, Configuration } from "openai";

@Injectable()
export class QuickNoteService {
  constructor(
    @InjectModel('QuickNote') private quickNoteModel: Model<QuickNote>) { }


  async create(data: CreateQuickNoteDto, currentUser): Promise<QuickNote> {
    try {
      const createdQuickNote = await this.quickNoteModel.create({
        ...data,
        userId: currentUser.id
      });
      console.log("createdQuickNote",createdQuickNote)
      return createdQuickNote;
    } catch (error) {
      throw new Error(`Failed to create a new quick note`);
    }
  }

  async update(quickNoteDto: UpdateQuickNoteDto, currentUser): Promise<QuickNote> {
    try {
      console.log("quickNoteDto---",quickNoteDto.data)
      const existingQuickNote = await this.quickNoteModel.findOne({userId: currentUser.id });

      if (!existingQuickNote) {
        throw new Error(`Quick note with id not found for the current user`);
      }
      const updatedData = quickNoteDto.data;
      console.log("updatedData===", updatedData);
      console.log(existingQuickNote.userId, currentUser.id)
      const updatedQuickNote = await this.quickNoteModel.findOneAndUpdate(
        { userId: currentUser.id },
        { $set: { data: updatedData } },
        { new: true }
      );
      console.log("updatedQuickNote---", updatedQuickNote)
      return updatedQuickNote;
    } catch (error) {
      throw new Error(`Failed to update the quick note with ID`);
    }
  }

  async get(currentUser): Promise<QuickNote> {
    try {
      const quickNote = await this.quickNoteModel.findOne({userId: currentUser.id });

      if (!quickNote) {
        throw new Error(`Quick note with ID  not found for the current user`);
      }

      return quickNote;
    } catch (error) {
      throw new Error(`Failed to fetch the quick note with ID`);
    }
  }

  async delete(id: string, currentUser): Promise<QuickNote> {
    try {
      const deletedQuickNote = await this.quickNoteModel.findOneAndDelete({ _id: id, userId: currentUser.id });

      if (!deletedQuickNote) {
        throw new Error(`Quick note with ID ${id} not found for the current user`);
      }

      return deletedQuickNote;
    } catch (error) {
      throw new Error(`Failed to delete the quick note with ID ${id}`);
    }
  }
}
