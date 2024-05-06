import { Body, Controller, HttpException, HttpStatus, Param, Post, Put, Get, Delete } from '@nestjs/common';
import { QuickNoteService } from './quick-note.service';
import { CreateQuickNoteDto } from './dto/quickNote.dto';

@Controller('quick-note')
export class QuickNoteController {
    constructor(private quickNoteService : QuickNoteService){}

    @Post('/quickEmail/:userId')
    async processData(@Body() body: any) {
      const data = body.data;
  
      console.log(data);
  
      const response = await this.quickNoteService.generateResponse(data);
      console.log("response ---", response)
      return response;
    }

    @Post('/')
    async create(@Body() page: CreateQuickNoteDto): Promise<any> {
        try {
            const newPage = await this.quickNoteService.create(page);

            return newPage;
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() page: CreateQuickNoteDto): Promise<any> {
        try {
            const updatedPage = await this.quickNoteService.update({ ...page, _id: id });

            return updatedPage;
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/:id')
    async get(@Param('id') id: string): Promise<any> {
        try {
            const page = await this.quickNoteService.get(id);

            return page;
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete("/:id")
    async delete(@Param('id') id : string) : Promise<any>
    {
        try
        {
            const page = await this.quickNoteService.delete(id);
            return page;
        }
        catch(error)
        {
            throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
