import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IColumn } from '../../interfaces/column.interface';

@Component({
  selector: 'app-date-filtering',
  templateUrl: './date-filtering.component.html',
  styleUrl: './date-filtering.component.scss',
  providers: [DatePipe],
  standalone: false
})
export class DateFilteringComponent {
  @Input() col: IColumn = {
    field: '',
    header: ''
  };

  constructor(private readonly datePipe: DatePipe) {}
  
  formatDateFilters(date: string | string[]): string | Date[] {
    if(Array.isArray(date)){
      let [start, end] = date;
      
      start = this.datePipe.transform(start, 'yyyy-MM-dd') ?? '';
      end = this.datePipe.transform(end, 'yyyy-MM-dd') ?? '';
      
      if(start && end){
        return [new Date(start), new Date(end)];
      } else {
        return [new Date(start)];
      }
    }
    return date;
  }
}
