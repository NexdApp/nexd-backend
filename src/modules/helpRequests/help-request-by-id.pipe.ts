import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { HelpRequestsService } from './help-requests.service';

@Injectable()
export class HelpRequestByIdPipe implements PipeTransform<string> {
  constructor(private readonly helpRequestsService: HelpRequestsService) {}

  transform(value: string, metadata: ArgumentMetadata) {
    return this.helpRequestsService.get(Number(value));
  }
}
