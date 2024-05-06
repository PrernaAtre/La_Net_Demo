import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuickNote } from './schema/quickNote.schema';
import { Model } from 'mongoose';
import { CreateQuickNoteDto } from './dto/quickNote.dto';
import OpenAI from "openai";
// import { OpenAIApi, Configuration } from "openai";

@Injectable()
export class QuickNoteService {
  constructor(
    @InjectModel('QuickNote') private quickNoteModel: Model<QuickNote>) { }

  async generateResponse(userMessage: string) {
    console.log("userMessage---", userMessage);

    const openAI = new OpenAI(({
      apiKey: process.env.OPEN_AI_KEY,
    }));
    const completion = await openAI.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMessage },
      ],
      model: 'gpt-3.5-turbo',
    });
    const createdEmail = new this.quickNoteModel({
      title: userMessage,
      userId: "123456",
      description: completion.choices[0].message.content
    });
    await createdEmail.save();
    return completion.choices[0].message.content;
  }

  async create(page: CreateQuickNoteDto) {
    try {
      const createdPage = await new this.quickNoteModel(page).save();

      return createdPage;
    } catch (error) {
      throw new Error(`[Create Page] [${page._id}] [${page.userId}]: Error creating page`);
    }
  }

  async update(page: CreateQuickNoteDto) {
    try {

      const updatedPage = await this.quickNoteModel.findByIdAndUpdate(page._id, page, { new: true });

      return updatedPage;
    } catch (error) {
      throw new Error(`[Update Page] [${page._id}] [${page.userId}]: Error updating page`);
    }
  }

  async get(id: string) {
    try {
      const page = await this.quickNoteModel.findById(id);

      if (!page) throw new Error("Page not found");

      return page;
    } catch (error) {
      throw new Error(`[Get Page] [${id}]: Error fetching page`);
    }
  }

  async delete( id: string)
  {
    try
    {
        const page = await this.quickNoteModel.findByIdAndDelete(id);
        if(!page) throw new Error("page not found");
        return page;
    }
    catch(error)
    {
        throw new Error(`[Delete Page] [${id}]: Error Deleting page`)
    }
  }
}
