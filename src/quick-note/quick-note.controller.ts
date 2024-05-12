import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from "src/common/utils/common.types";
import { QuickNoteService } from './quick-note.service';
import { CreateQuickNoteDto, UpdateQuickNoteDto } from './dto/quickNote.dto';

@Controller('quickNote')
export class QuickNoteController {
    constructor(private quickNoteService : QuickNoteService){}

    @Post('/')
    @UseGuards(AuthGuard)
    async create(@Body() data: CreateQuickNoteDto, @Req() { currentUser }: AuthenticatedRequest): Promise<any> {
      try {
        console.log("data in controller---", data);
        const newQuickNote = await this.quickNoteService.create(data, currentUser);
        return newQuickNote;
      } catch (error) {
        throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Put('/')
    @UseGuards(AuthGuard)
    async update(@Body() data: UpdateQuickNoteDto, @Req() { currentUser }: AuthenticatedRequest): Promise<any> {
      try {
        console.log("data in update---",data)
        console.log("In controller----",currentUser);
        const updatedQuickNote = await this.quickNoteService.update(data, currentUser);
        return updatedQuickNote;
      } catch (error) {
        throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Get('/')
    @UseGuards(AuthGuard)
    async get(@Req() { currentUser }: AuthenticatedRequest): Promise<any> {
      try {
        const quickNote = await this.quickNoteService.get(currentUser);
        return quickNote;
      } catch (error) {
        throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Delete('/:id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string, @Req() { currentUser }: AuthenticatedRequest): Promise<any> {
      try {
        const deletedQuickNote = await this.quickNoteService.delete(id, currentUser);
        return deletedQuickNote;
      } catch (error) {
        throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

}
