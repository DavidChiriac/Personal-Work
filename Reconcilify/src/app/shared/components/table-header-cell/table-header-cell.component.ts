import { AfterViewChecked, Component, EventEmitter, Input, Output } from '@angular/core';
import { LeaverReportFilters } from '../../../leavers/leaver-report/models/leaver-report-table.filters';
import { ProductsMappingFilters } from '../../../hierarchy-mapper/products-mapping/models/products-mapping-table-filters';
import { UserGroupFilters } from '../../../administration/user-group-management/models/userGroup.filters';
import { SortDirectionEnum } from '../../utils/sort-directions';
import { IColumn } from '../../interfaces/column.interface';
import { Table } from 'primeng/table';
import { LeaverReportAcknowledgementFilters } from '../../../leavers/leaver-report-acknowledgement/models/leaver-report-acknowledgement-table.filters';

@Component({
  selector: 'app-table-header-cell',
  templateUrl: './table-header-cell.component.html',
  styleUrl: './table-header-cell.component.scss',
  standalone: false
})
export class TableHeaderCellComponent implements AfterViewChecked {
  @Input() col: IColumn = {
    field: '',
    header: '',
  };
  @Input() table!: Table;
  @Input() statusOptions!: boolean[];
  @Input() acknowledgeOptions!: number[] | null;
  @Input() backdatedLeaverOptions!: boolean[] | null;
  @Input() tableFilters!: LeaverReportFilters | ProductsMappingFilters | UserGroupFilters | LeaverReportAcknowledgementFilters;
  @Input() requestParams!: {fieldToSort: string | null, sortDirection: SortDirectionEnum | string | null};
  @Input() noOfFrozenColumns!: number;
  
  @Output() freezeColumn = new EventEmitter();
  @Output() sort = new EventEmitter();

  SortDirectionEnum = SortDirectionEnum;

  statusFilters: { label: string, active: boolean }[] = [
    {label: 'Active', active: true},
    {label: 'Inactive', active: false}
  ];

  acknowledgeFilters: { label: string, status: number }[] = [
    {label: 'Acknowledged', status: 2},
    {label: 'Pending', status: 1}
  ];

  backdatedLeaverFilters: { label: string, value: boolean }[] = [
    {label: 'Yes', value: true},
    {label: 'No', value: false}
  ];

  ngAfterViewChecked(): void {
    if(this.statusOptions){
      this.statusFilters = [];

      this.statusOptions.forEach((option) => {
        if(this.statusFilters.findIndex((status) => status.active === option) === -1){
          this.statusFilters.push({label: option ? 'Active' : 'Inactive', active: option});
        }
      });
    }

    if(this.acknowledgeOptions){
      this.acknowledgeFilters = [];

      this.acknowledgeOptions.forEach((option) => {
        if(this.acknowledgeFilters.findIndex((filter) => filter.status === option) === -1){
          this.acknowledgeFilters.push({label: option === 2 ? 'Acknowledged' : 'Pending', status: option});
        }
      });
    }

    if(this.backdatedLeaverOptions){
      this.backdatedLeaverFilters = [];

      this.backdatedLeaverOptions.forEach((option) => {
        if(this.backdatedLeaverFilters.findIndex((filter) => filter.value === option) === -1){
          this.backdatedLeaverFilters.push({label: option === true ? 'Yes' : 'No', value: option});
        }
      });
    }
  }
  
  onSort(field: string, event: Event): void{
    this.sort.emit({field, event});
  }

  toggleFrozeOnColumn(col: IColumn, newFrozenStatus: boolean = false): void {
    if(newFrozenStatus){
      this.noOfFrozenColumns += 1;
    } else {
      this.noOfFrozenColumns -= 1;
    }
    this.freezeColumn.emit({col, newFrozenStatus});
  }
}
