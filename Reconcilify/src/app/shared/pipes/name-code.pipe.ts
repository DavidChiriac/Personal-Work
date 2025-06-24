import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameCode',
  standalone: false
})
export class NameCodePipe implements PipeTransform {

  transform(value: string | {code: string, name: string}): string {
    if(value && typeof value === 'object'){
      if(value.name && value.code){
        return `${value.code} - ${value.name}`;
      } else if(value.name) return value.name;
      else if(value.code) return value.code;
      return '';
    }
    return value;
  }

}
