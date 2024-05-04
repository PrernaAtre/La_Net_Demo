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

    @Post('/quickEmail/:userId')
    async processData(@Body() body: any) {
      const data = body.data;
  
      console.log(data);
  
      const response = await this.quickNoteService.generateResponse(data);
      console.log("response ---", response)
      return response;
    }
}
