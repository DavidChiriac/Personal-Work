import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'week',
  standalone: false
})
export class WeekPipe implements PipeTransform {

  transform(week: {weekNumber: string, retrievedOnFrom: string, retrievedOnTo: string} | undefined): string {
    if(!week){
      return '';
    }
    return `Week ${week.weekNumber} (${week.retrievedOnFrom} - ${week.retrievedOnTo})`;
  }

}
