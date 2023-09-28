import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MyPcsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value = Number(value);
    if (isNaN(value) || value <= 0) value = 1;
    return value;
  }
}
