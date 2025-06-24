import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenNumber',
  standalone: false
})
export class ShortenNumberPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if(value !== undefined && value !== null){
      if (value >= 1000 && value < 1_000_000) {
        return (value / 1000).toFixed(1) + 'K';
      } else if (value >= 1_000_000 && value < 1_000_000_000) {
        return (value / 1_000_000).toFixed(1) + 'M';
      } else if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(1) + 'B';
      }
      return value.toString();
    }
    return '';
  }
}
