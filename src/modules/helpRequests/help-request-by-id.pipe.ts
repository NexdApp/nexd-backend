import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { HelpRequestsService } from './help-requests.service';

@Injectable()
export class HelpRequestByIdPipe implements PipeTransform<string> {
  constructor(private readonly helpRequestsService: HelpRequestsService) {}

  transform(value: string, metadata: ArgumentMetadata) {
    const isNumeric =
      ['string', 'number'].includes(typeof value) &&
      !isNaN(parseFloat(value)) &&
      isFinite(value as any);
    if (!isNumeric) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }

    return this.helpRequestsService.getById(Number(value));
  }
}
