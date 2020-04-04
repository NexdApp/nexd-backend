import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { HelpListsService } from './help-lists.service';

@Injectable()
export class HelpListByIdPipe implements PipeTransform<string> {
  constructor(private readonly helpListsService: HelpListsService) {}

  transform(value: string, metadata: ArgumentMetadata) {
    return this.helpListsService.getById('', Number(value), {
      checkOwner: false,
    });
  }
}
