import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return this.trimObject(value);
  }

  private trimObject(obj: any): any {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
          if (!obj[key]) obj[key] = null;
        } else if (typeof obj[key] === 'object') {
          obj[key] = this.trimObject(obj[key]);
        }
      });
    }
    return obj;
  }
}
