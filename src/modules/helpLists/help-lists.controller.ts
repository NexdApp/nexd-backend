import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { HelpListsService } from './help-lists.service';
import { HelpList } from './help-list.entity';
import { HelpListCreateDto } from './dto/help-list-create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HelpRequestsService } from '../helpRequests/help-requests.service';
import { ReqUser } from 'src/decorators/user.decorator';
import { UserID } from '../users/user.entity';

@ApiBearerAuth()
@ApiTags('Help Lists')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('help-lists')
export class HelpListsController {
  static LOGGER = new Logger('HelpLists', true);

  constructor(
    private readonly helpListsService: HelpListsService,
    private readonly helpRequestService: HelpRequestsService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get help lists of the requesting user' })
  @ApiOkResponse({ description: 'Successful', type: [HelpList] })
  async getUserLists(@ReqUser() user: UserID): Promise<HelpList[]> {
    return await this.helpListsService.getAllByUser(user.userId);
  }

  @Get('me/:helpListId')
  @ApiOkResponse({ description: 'Successful', type: HelpList })
  @ApiNotFoundResponse({ description: 'Help list not found' })
  @ApiForbiddenResponse({ description: 'This is not your help list' })
  async findOne(
    @Param('helpListId') helpListId: number,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return await this.helpListsService.get(user.userId, helpListId);
  }

  @Post('me')
  @ApiOperation({ summary: 'Add a new help list for the current user' })
  @ApiCreatedResponse({
    description: 'Added a new help list',
    type: HelpList,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async insertNewHelpList(
    @Body() createRequestDto: HelpListCreateDto,
    @ReqUser() user: UserID,
  ): Promise<HelpList> {
    return this.helpListsService.create(user.userId, createRequestDto);
  }

  // @Put(':id')
  // @ApiOkResponse({ description: 'Successful', type: HelpLists })
  // @ApiBadRequestResponse({ description: 'Bad request' })
  // @ApiNotFoundResponse({ description: 'Shopping list not found' })
  // @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  // async updateHelpLists(
  //   @Param('id') id: number,
  //   @Body() updateHelpLists: HelpListsFormDto,
  //   @ReqUser() user: UserID,
  // ): Promise<HelpLists> {
  //   const HelpLists = await this.findHelpLists(id, user.userId);
  //   return this.HelpListsService.update(updateHelpLists, HelpLists);
  // }

  // @Put(':HelpListsId/:requestId')
  // @ApiOkResponse({ description: 'Successful', type: HelpLists })
  // @ApiBadRequestResponse({ description: 'Bad request' })
  // @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  // @ApiNotFoundResponse({ description: 'Shopping list not found' })
  // async addRequestToList(
  //   @Param('HelpListsId') HelpListsId: number,
  //   @Param('requestId') requestId: number,
  //   @ReqUser() user: UserID,
  // ): Promise<HelpLists> {
  //   const HelpLists = await this.findHelpLists(HelpListsId, user.userId);
  //   const updateDto = new HelpListsFormDto();
  //   updateDto.requests = HelpLists.requests.map(r => r.requestId);
  //   updateDto.requests.push(requestId);
  //   return this.HelpListsService.update(updateDto, HelpLists);
  // }

  // @Delete(':HelpListsId/:requestId')
  // @ApiOkResponse({ description: 'Successful', type: HelpLists })
  // @ApiBadRequestResponse({ description: 'Bad request' })
  // @ApiForbiddenResponse({ description: 'This is not your shopping list' })
  // @ApiNotFoundResponse({ description: 'Shopping list not found' })
  // async deleteRequestFromList(
  //   @Param('HelpListsId') HelpListsId: number,
  //   @Param('requestId') requestId: number,
  //   @ReqUser() user: UserID,
  // ): Promise<HelpLists> {
  //   const HelpLists = await this.findHelpLists(HelpListsId, user.userId);
  //   return this.HelpListsService.removeRequest(requestId, HelpLists);
  // }

  // private async findHelpLists(id: number, userId: number) {
  //   const HelpLists = await this.HelpListsService.get(id);
  //   if (HelpLists.owner !== userId) {
  //     throw new ForbiddenException(
  //       'You can only see or edit your own shopping lists!',
  //     );
  //   }
  //   return HelpLists;
  // }
}
