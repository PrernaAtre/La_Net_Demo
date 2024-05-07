import { Body, Controller, Param, Post } from '@nestjs/common';
import { QuickNoteService } from './quick-note.service';

@Controller('quick-note')
export class QuickNoteController {
    constructor(private quickNoteService : QuickNoteService){}

    @Post('/createQuickNote/:userId')
    async createQuickNote(
        @Param('userId') userId: string,
        @Body('title') title: string
    ) {
        // Call the service method to create a quick note
        const createdNote = await this.quickNoteService.createQuickNote(userId, title);
        return createdNote; // You might want to return the created note or an appropriate response
    }

    @Post('/quickEmail')
    async processData(@Body() reqBody: any) {
      const data = reqBody.data;
  
      console.log(data);
  
      const response = await this.quickNoteService.generateResponse(data);
  
      return response;
    }
}
