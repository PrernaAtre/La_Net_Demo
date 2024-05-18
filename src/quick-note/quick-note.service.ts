import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuickNote } from '../models/quickNote.schema';
import mongoose, { Model } from 'mongoose';
import { CreateQuickNoteDto, UpdateQuickNoteDto } from './dto/quickNote.dto';
import OpenAI from "openai";
// import { OpenAIApi, Configuration } from "openai";

@Injectable()
export class QuickNoteService {
  constructor(
    @InjectModel('QuickNote') private quickNoteModel: Model<QuickNote>) { }


  async update(quickNoteDto: UpdateQuickNoteDto, currentUser): Promise<QuickNote> {
    try {
      const existingQuickNote = await this.quickNoteModel.findOne({userId: currentUser.id });

      if (!existingQuickNote) {
        throw new Error(`Quick note with id not found for the current user`);
      }
      const updatedData = quickNoteDto.data;
      const updatedQuickNote = await this.quickNoteModel.findOneAndUpdate(
        { userId: currentUser.id },
        { $set: { data: updatedData } },
        { new: true }
      );
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
}
