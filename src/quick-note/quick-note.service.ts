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
            apiKey: "sk-proj-7FFF4Lks4j6dXV8NgGaTT3BlbkFJD9CFnsjeMKRM8ajBojRY",
          }));
        const completion = await openAI.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages:[{ role: "user", content: title }],
        });
        console.log(completion);
        console.log(completion.choices[0].message.content);
        const createdNote = new this.quickNoteModel({
            title,
            userId,
        });
        // Save the new quick note to the database
        return await createdNote.save();
    }

}
