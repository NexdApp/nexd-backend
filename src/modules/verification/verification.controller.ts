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
  @ApiOperation({ summary: 'Verify phone number via sms' })
  @ApiOkResponse({
    description: 'Successful Request',
  })
  async request(@Body() requestDto: RequestDto): Promise<void> {
    this.logger.log(`Attempt to verify phone number`);
    return await this.verificationService.requestSMS(requestDto.phoneNumber);
  }

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify phone number via sms' })
  @ApiOkResponse({
    description: 'Successful Verification',
  })
  async verify(@Body() verifyDto: VerificationDto): Promise<boolean> {
    this.logger.log(`Attempt to verify phone number`);
    return this.verificationService.verifyNumber(verifyDto.phoneNumber, verifyDto.OTP);
  }
}
