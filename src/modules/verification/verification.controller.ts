import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { VerificationService } from './verification.service';
import { UsersService } from '../users/users.service';
import { HttpBadRequestResponse } from '../../errorHandling/httpBadRequestResponse.model';
import { RequestDto, VerificationDto } from './dto/verificationDto';

@ApiTags('Users')
@Controller('verification')
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: HttpBadRequestResponse,
})
export class VerificationController {
  private readonly logger = new Logger(VerificationController.name);

  constructor(
    private verificationService: VerificationService,
    private usersService: UsersService,
  ) {
  }

  @Post('/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request phone number verification via SMS' })
  @ApiOkResponse({
    description: 'Requested',
  })
  async request(@Body() requestDto: RequestDto): Promise<void> {
    return await this.verificationService.requestSMS(requestDto.phoneNumber);
  }

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify phone number via sms' })
  @ApiOkResponse({ description: 'Successful Verification' })
  @ApiBadRequestResponse({ description: 'Could not verify phone number' })
  async verify(@Body() verifyDto: VerificationDto): Promise<void> {
    return this.verificationService.verifyNumber(verifyDto.phoneNumber, verifyDto.OTP);
  }

  @Post('/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset code verification' })
  @ApiOkResponse({ description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unkown phone number' })
  async reset(@Body() verifyDto: RequestDto): Promise<void> {
    return this.verificationService.reset(verifyDto.phoneNumber);
  }
}
