import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/CreatePage.dto';

@Controller('page')
export class PageController {
    constructor(private pageService: PageService) { }

    @Post('/:userId')
    async addPage(@Body() pages: Array<{ id: string, type: string, content: string, children: Array<{ id: string, type: string, content: string }> }>, @Param('userId') userId: string) {
        try {
            console.log("Pages received:", pages);
            console.log("User ID:", userId);

            const newPage = await this.pageService.addPage(pages, userId);
            console.log("New Page:", newPage);

            return newPage;
        } catch (error) {
            console.error("Error adding pages:", error);
            throw error; // Rethrow the error to be handled by NestJS error handling
        }
    }

    @Post('/')
    async create(@Body() page: CreatePageDto): Promise<any> {
        try {
            const newPage = await this.pageService.create(page);

            return newPage;
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Put('/:id')
    async update(@Param('id') id: string, @Body() page: CreatePageDto): Promise<any> {
        try {
            const updatedPage = await this.pageService.update({ ...page, _id: id });

            return updatedPage;
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/:id')
    async get(@Param('id') id: string): Promise<any> {
        try {
            const page = await this.pageService.get(id);

            return page;
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/user/:userId')
    async pages(@Param('userId') userId: string): Promise<any> {
        try {
            const pages = await this.pageService.pages(userId);

            console.log("pages", pages)
            return pages;
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('/trash/:id')
    async makeTrash(@Param('id') id: string): Promise<any> {
        try {
            const page = await this.pageService.makeTrashed(id);

            return page;
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('/recover/:id')
    async recover(@Param('id') id: string): Promise<any> {
        try {
            const page = await this.pageService.recover(id);

            return page;
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete('/:id')
    async delete(@Param('id') id: string): Promise<any> {
        try {
            
            const page = await this.pageService.delete(id);
            return page;

        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
