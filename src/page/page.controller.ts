import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { PageService } from "./page.service";
import {
  AddSharedUsersDto,
  CreatePageDto,
  RemoveSharedUsersDto,
  UpdatePageDto,
} from "./dto/CreatePage.dto";
import { AuthGuard } from "src/auth/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/auth.controller";
import { CheckPublishLimitMiddleware } from "src/middleware/page.middleware";
import { ObjectIdValidationPipe } from "src/common/utils/objectidvalidation.middleware";

@Controller("page")
export class PageController {
  constructor(private pageService: PageService) {}
  
  @Get("sharedpages")
  @UseGuards(AuthGuard)
  async getSharedPages(
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<any> {
    return await this.pageService.getSharedPages(currentUser);
  }
  
  @Put("/shared-users/:id")
  @UseGuards(AuthGuard)
  async addSharedUsers(
    @Param("id") id: string,
    @Req() { currentUser }: AuthenticatedRequest,
    @Body() addSharedUsersDto: AddSharedUsersDto
  ): Promise<any> {
    return await this.pageService.addSharedUsers(
      id,
      addSharedUsersDto.userIds,
      currentUser
    );
  }

  @Delete("/shared-users/:id")
  @UseGuards(AuthGuard)
  async removeSharedUsers(
    @Param("id") id: string,
    @Req() { currentUser }: AuthenticatedRequest,
    @Body() removeSharedUsersDto: RemoveSharedUsersDto
  ): Promise<any> {
    return await this.pageService.removeSharedUsers(
      id,
      removeSharedUsersDto.userId,
      currentUser
    );
  }
  @Post("/")
  @UseGuards(AuthGuard)
  async create(
    @Body() page: CreatePageDto,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<any> {
    return await this.pageService.create(page, currentUser);
  }

  @Put("/:id")
  @UseGuards(AuthGuard)
  @UsePipes(new ObjectIdValidationPipe())
  async update(
    @Param("id") id: string,
    @Body() page: UpdatePageDto,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<any> {
    return await this.pageService.update(id, page, currentUser);
  }

  @Get("/:id")
  @UseGuards(AuthGuard)
  @UsePipes(new ObjectIdValidationPipe())
  async get(
    @Param("id") id: string,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<any> {
    return await this.pageService.get(id, currentUser);
  }

  @Get("/user/:userId")
  @UseGuards(AuthGuard)
  async pages(
    @Req() req: Request,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<any> {
    return await this.pageService.pages(currentUser);
  }

  @Put("/trash/:id")
  @UseGuards(AuthGuard)
  @UsePipes(new ObjectIdValidationPipe())
  async makeTrash(
    @Param("id") id: string,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<any> {
    return await this.pageService.makeTrashed(id, currentUser);
  }

  @Put("/recover/:id")
  @UseGuards(AuthGuard)
  @UsePipes(new ObjectIdValidationPipe())
  async recover(
    @Param("id") id: string,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<any> {
    return await this.pageService.recover(id, currentUser);
  }

  @Delete("/:id")
  @UseGuards(AuthGuard)
  @UsePipes(new ObjectIdValidationPipe())
  async delete(
    @Param("id") id: string,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<any> {
    return await this.pageService.delete(id, currentUser);
  }

  @Put("/publish/:id")
  @UseGuards(AuthGuard)
  @UsePipes(new ObjectIdValidationPipe())
  async publish(
    @Param("id") id: string,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<any> {
    return await this.pageService.publishPage(id, currentUser);
  }

  @Put("/unpublish/:id")
  @UseGuards(AuthGuard)
  @UsePipes(new ObjectIdValidationPipe())
  async unpublish(
    @Param("id") id: string,
    @Req() { currentUser }: AuthenticatedRequest
  ): Promise<any> {
    return await this.pageService.unpublish(id, currentUser);
  }
}
