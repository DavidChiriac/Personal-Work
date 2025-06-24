import { Component, Input } from '@angular/core';
import { IColumn } from '../../interfaces/column.interface';
import { DatePipe } from '@angular/common';
import { SelectionMode } from '../../directives/calendar-mode-toggle.directive';

@Component({
  selector: 'app-dynamic-selection-date-filtering',
  templateUrl: './dynamic-selection-date-filtering.component.html',
  styleUrl: './dynamic-selection-date-filtering.component.scss',
  standalone: false
})
export class DynamicSelectionDateFilteringComponent {
  @Input() col: IColumn = {
    field: '',
    header: ''
  };
  @Input() dynamicSelectionMode = true;

  selectionMode: SelectionMode = 'single';

  constructor(private readonly datePipe: DatePipe) {}
  
  formatDateFilters(date: string | string[]): Date | Date[] {
    if(Array.isArray(date) && date[1]){
      let [start, end] = date;
      
      start = this.datePipe.transform(start, 'yyyy-MM-dd') ?? '';
      end = this.datePipe.transform(end, 'yyyy-MM-dd') ?? '';
      
      if(start && end){
        return [new Date(start), new Date(end)];
      } else {
        return [new Date(start)];
      }
    }

    return Array.isArray(date) ? [new Date(date[0])] : [new Date(date)];
  }

  changeSelectionMode(mode: SelectionMode): void {
    this.selectionMode = mode;
  }
}
