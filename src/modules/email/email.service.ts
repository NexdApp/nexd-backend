import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { ConfigurationService } from '../../configuration/configuration.service';

@Injectable()
export class EmailService {
  private sendgrid = require('@sendgrid/mail');
  private readonly logger = new Logger(EmailService.name);
  private authorisedEmailId = this.configService.get('AUTHORISED_TRANSACTIONAL_EMAIL');
  private emailTemplateId = this.configService.get('EMAIL_VERIFICATION_TEMPLATE_ID');
  constructor(private configService: ConfigurationService) {
    this.sendgrid.setApiKey(configService.get('SENDGRID_API_KEY'));
  }
  async SendEmailVerificaion(emailId: string): Promise<any> {
    this.logger.log(`Send Email verification`);
    const msg = {
      to: emailId,
      from: this.authorisedEmailId,
      template_id: this.emailTemplateId
    };
    //ES6
    this.sendgrid.send(msg).then(() => { }, error => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body)
      }
    });
    //ES8
    // (async () => {
    //   try {
    //     await this.sendgrid.send(msg);
    //   } catch (error) {
    //     console.error(error);

    //     if (error.response) {
    //       console.error(error.response.body)
    //     }
    //   }
    // })();

    return null;
  }
}
