import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DefaultPaginationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query' && !value) {
      if (metadata.data === 'page') value = 1;
      if (metadata.data === 'totalPage') value = 10;
    }
    if (metadata.data === 'page' || metadata.data === 'totalPage') return Number(value);
    return value;
  }
}
