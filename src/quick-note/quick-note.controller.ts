import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from "src/common/utils/common.types";
import { QuickNoteService } from './quick-note.service';
import { CreateQuickNoteDto, UpdateQuickNoteDto } from './dto/quickNote.dto';

@Controller('quickNote')
export class QuickNoteController {
    constructor(private quickNoteService : QuickNoteService){}

    @Put('/')
    @UseGuards(AuthGuard)
    async update(@Body() data: UpdateQuickNoteDto, @Req() { currentUser }: AuthenticatedRequest): Promise<any> {
      try {
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
}
