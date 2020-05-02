import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { HelpListsService } from './help-lists.service';

@Injectable()
export class HelpListByIdPipe implements PipeTransform<string> {
  constructor(private readonly helpListsService: HelpListsService) {}

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

    return this.helpListsService.getById('', Number(value), {
      checkOwner: false,
    });
  }
}
