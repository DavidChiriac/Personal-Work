import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductsMappingStatusEnum } from '../../../hierarchy-mapper/products-mapping/models/products-mapping-status.enum';

interface IGlobalFilter {
  label: string;
  count?: number;
  retrievedOnFrom?: string;
  retrievedOnTo?: string;
  id?: ProductsMappingStatusEnum;
}

@Component({
  selector: 'app-table-mass-filters',
  templateUrl: './table-mass-filters.component.html',
  styleUrl: './table-mass-filters.component.scss',
  standalone: false
})
export class TableMassFiltersComponent {
  @Input() globalFilters!: IGlobalFilter[];

  @Input() selectedQuickFilter!: IGlobalFilter;

  @Output() selectMassFilter = new EventEmitter();

  selectQuickFilter(filter: IGlobalFilter): void {
    this.selectMassFilter.emit(filter);
  }
}
