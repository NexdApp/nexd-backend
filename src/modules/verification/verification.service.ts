import { Injectable, Logger } from '@nestjs/common';
import { ConfigurationService } from '../../configuration/configuration.service';

const Twilio = require('twilio');

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);
  private readonly expirationTime = 900;

  private twilioClient;
  private sendingPhoneNumber: string;
  private appHash: string;

  // Replace with Database, Memcache or Redis?
  private verificationMap = new Map<string, number>();

  constructor(configService: ConfigurationService) {
    let message = null;
    if (configService.get('TWILIO_API_KEY') == null ||
      configService.get('TWILIO_API_SECRET') == null ||
      configService.get('TWILIO_ACCOUNT_SID') == null) {
      message = 'Please copy the .env.example file to .env, and then add your Twilio API Key, API Secret, ' +
        'and Account SID to the .env file. Find them on https://www.twilio.com/console';
    }
    if (configService.get('SENDING_PHONE_NUMBER') == null) {
      message = 'Please provide a valid phone number, such as +15125551212, in the .env file';
    }
    if (configService.get('CLIENT_SECRET') == null) {
      message = 'Please provide a secret string to share, between the app and the server in the .env file';
    }
    if (message) {
      console.log(message);
      Logger.error('Twilio will not work!', message);
    } else {
      const configuredClientSecret = configService.get('CLIENT_SECRET');

      // Initialize the Twilio Client
      this.twilioClient = new Twilio(configService.get('TWILIO_API_KEY'),
        configService.get('TWILIO_API_SECRET'),
        { accountSid: configService.get('TWILIO_ACCOUNT_SID') });

      this.sendingPhoneNumber = configService.get('SENDING_PHONE_NUMBER');
      this.appHash = configService.get('APP_HASH');
    }
  }

  requestSMS(phone) {
    console.log('Requesting SMS to be sent to ' + phone);

    const otp = this.generateOneTimeCode();
    this.verificationMap.set(phone, otp);
    this.logger.log(`Phone: ${phone}, OTP: ${otp}`);

    const smsMessage = '[#] Use ' + otp + ' as your code for the app!\n' + this.appHash;
    this.logger.log('Message: ' + smsMessage);

    return this.twilioClient.messages.create({
      to: phone,
      from: this.sendingPhoneNumber,
      body: smsMessage,
    }).then((message) => this.logger.log(message.sid));
  };

  verifyNumber(phone, smsMessage) {
    this.logger.log('Verifying ' + phone + ':' + smsMessage);
    const otp = this.verificationMap.get(phone);
    if (otp == null) {
      this.logger.log('No cached otp value found for phone: ' + phone);
      return false;
    }
    if (smsMessage.indexOf(otp) > -1) {
      this.logger.log('Found otp value in cache');
      return true;
    } else {
      this.logger.log('Mismatch between otp value found and otp value expected');
      return false;
    }
  };

  reset(phone) {
    this.logger.log('Resetting code for:  ' + phone);
    const otp = this.verificationMap.get(phone);
    if (otp == null) {
      this.logger.log('No cached otp value found for phone: ' + phone);
      return false;
    }
    this.verificationMap.delete(phone);
    return true;
  };

  private generateOneTimeCode() {
    const codeLength = 6;
    return Math.floor(Math.random() * (Math.pow(10, (codeLength - 1)) * 9)) + Math.pow(10, (codeLength - 1));
  };
}
