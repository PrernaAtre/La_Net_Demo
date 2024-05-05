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

    async createQuickNote(userId: string, title: string): Promise<QuickNote> {
        console.log(" user id : ", userId)
        console.log("title : ", title)
        console.log("key ----------",process.env.OPEN_AI_KEY);
        
        // Create a new quick note instance
        // const openAI = new OpenAIApi(new Configuration({
        //     apiKey: process.env.OPENAI_API_KEY,
        //   }));
        const openAI = new OpenAI(({
            apiKey: "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",
          }));
        const completion = await openAI.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages:[{ role: "user", content: title }],
        });
      //  console.log(completion);
        console.log(completion.choices[0].message.content);
        const createdNote = new this.quickNoteModel({
            title,
            userId,
            description : completion.choices[0].message.content
        });
        // Save the new quick note to the database
        return await createdNote.save();
    }

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
            title : userMessage,
            userId : "123456",
            description : completion.choices[0].message.content
        });
        await createdEmail.save();
        return completion.choices[0].message.content;
      }
}
