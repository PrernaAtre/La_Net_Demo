import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto, UpdatePageDto } from './dto/CreatePage.dto';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/auth.controller';

@Controller('page')
export class PageController {
  constructor(private pageService: PageService) { }

  @Post('/')
  @UseGuards(AuthGuard)
  async create(@Body() page: CreatePageDto, @Req() { currentUser }: AuthenticatedRequest): Promise<any> {
    try {
      const newPage = await this.pageService.create(page, currentUser);

      return newPage;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Put('/:id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() page: UpdatePageDto, @Req() { currentUser }: AuthenticatedRequest): Promise<any> {
    try {
      const updatedPage = await this.pageService.update(id, page, currentUser);

      return updatedPage;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async get(@Param('id') id: string, @Req() { currentUser }: AuthenticatedRequest): Promise<any> {
    try {
      const page = await this.pageService.get(id, currentUser);

      return page;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/user/:userId')
  @UseGuards(AuthGuard)
  async pages(@Req() req: Request, @Req() { currentUser }: AuthenticatedRequest): Promise<any> {
    try {

      const pages = await this.pageService.pages(currentUser);

      return pages;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/trash/:id')
  @UseGuards(AuthGuard)
  async makeTrash(@Param('id') id: string, @Req() { currentUser }: AuthenticatedRequest): Promise<any> {
    try {

      const page = await this.pageService.makeTrashed(id, currentUser);

      return page;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/recover/:id')
  @UseGuards(AuthGuard)
  async recover(@Param('id') id: string, @Req() { currentUser }: AuthenticatedRequest): Promise<any> {
    try {
      const page = await this.pageService.recover(id, currentUser);

      return page;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string, @Req() { currentUser }: AuthenticatedRequest): Promise<any> {
    try {
      const page = await this.pageService.delete(id, currentUser);

      return page;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
