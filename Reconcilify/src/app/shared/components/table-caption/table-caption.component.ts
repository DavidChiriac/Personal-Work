import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table-caption',
  templateUrl: './table-caption.component.html',
  styleUrl: './table-caption.component.scss',
  standalone: false
})
export class TableCaptionComponent {
  @Input() dt!: Table;
  @Input() emptyFilters = true;
  @Input() lazyLoading = false;
  @Output() clearFilters = new EventEmitter<void>();
  @Output() globalSearch = new EventEmitter<string>();

  globalSearchText: string = '';

  filterGlobal(): void {
    if (this.dt) {
      this.dt.clearFilterValues();
      this.dt.filterGlobal(this.globalSearchText, 'contains');
    } else {
      this.globalSearch.emit(this.globalSearchText);
    }
  }

  clearGlobalSearchText(): void {
    this.globalSearchText = '';
    this.filterGlobal();
  }

  clearAll(): void {
    this.clearFilters.emit();
    this.clearGlobalSearchText();
  }
}
