 
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MenuItem } from 'primeng/api';
import { saveAs } from 'file-saver';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SystemDuplicatesColumns } from './models/system-duplicates-columns';
import { SystemDuplicatesFilters } from './models/system-duplicates-filters';
import {
  ISystemDuplicate,
  ISystemDuplicatesRequestParams,
} from './models/system-duplicates-interfaces';
import { SupportTablesService } from '../support-tables.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { _isNilOrEmpty } from '../../../shared/utils/lodash-utils';
import { TableMultiselectOption } from '../../../shared/utils/table-filters-utils';
import { SortDirectionEnum } from '../../../shared/utils/sort-directions';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-system-duplicates-table',
  templateUrl: './system-duplicates.component.html',
  styleUrl: './system-duplicates.component.scss',
  providers: [DatePipe],
  standalone: false
})
export class SystemDuplicatesComponent implements OnInit {
  tableData: ISystemDuplicate[] = [];
  tableColumns = SystemDuplicatesColumns.getColumns();
  tableFilters: SystemDuplicatesFilters = new SystemDuplicatesFilters();
  requestParams!: ISystemDuplicatesRequestParams;
  totalRecords!: number;
  pageNumber: number = 0;
  globalSearchText: string = '';
  loading: boolean = false;

  emptyFilters!: boolean;
  isExportInProgress: boolean = false;
  deleteRecordVisible = false;
  deletedRecord!: string;

  errorMessage = '';

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  constructor(
    private readonly supportTablesService: SupportTablesService,
    private readonly datePipe: DatePipe
  ) {
    this.items = [
      { label: 'Support Tables' },
      { label: 'System Duplicates' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  ngOnInit(): void {
    this.requestParams = {
      globalSearchInput: '',
      pageSize: 20,
      pageNumber: 0
    };

    this.getTableFilters();
  }

  searchWithFilters(event: TableLazyLoadEvent | undefined = undefined): void{
    this.loading = true;
    
    if(event){
      this.requestParams.fieldToSort = Array.isArray(event?.sortField) ? event?.sortField[0] : event?.sortField ?? '';
      this.requestParams.sortDirection = this.getSortDirection(event);
      this.requestParams.pageNumber = (event.first ?? 0) / (event.rows ?? 20);
      this.requestParams.pageSize = event.rows ?? 20;
    }

    const params = this.buildParams();

    this.supportTablesService.getSystemDuplicatesData(params)?.pipe(untilDestroyed(this)).subscribe({
      next: (duplicates) => {
        this.tableData = duplicates?.systemDuplicateDTOs || [];
        this.totalRecords = duplicates?.filters?.numberOfRecords;

        this.tableData.forEach((row: ISystemDuplicate) => {
          row.retrievedOn = row.retrievedOn.substring(0, 10);
        });
      },
      error: () => {
        this.tableData = [];
        this.totalRecords = 0;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }}); 
  }

  getTableFilters(): void {
    this.loading = true;
    this.supportTablesService.getSystemDuplicatesFilters()?.pipe(untilDestroyed(this)).subscribe((filters: SystemDuplicatesFilters) => {
      this.tableFilters = this.supportTablesService.createSystemDuplicatesFilters(filters);
      this.loading = false;
    });
  }

  onMultiselectSelectionChange(
    selectedItems: Partial<ISystemDuplicate>[],
    field: string
  ): void {
    this.tableFilters[field] = selectedItems;

    this.searchWithFilters();
  }

  showDeleteDialog(id: string): void {
    this.deletedRecord = id;
    this.deleteRecordVisible = true;
  }

  closeDeleteDialog(): void {
    this.deleteRecordVisible = false;
  }

  deleteRow(): void {
    this.supportTablesService
      .deleteSystemDuplicateRecord(this.deletedRecord)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.closeDeleteDialog();
          this.searchWithFilters();
        },
        error: () => {
          this.closeDeleteDialog();
          alert('Error deleting record');
        },
      });
  }

  exportTableData(): void {
    const params = this.buildParams();

    this.isExportInProgress = true;

    this.supportTablesService
      .exportSystemDuplicatesData(params)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: HttpResponse<object>) => {
          if (res.body) {
            const blob = new Blob([res.body as BlobPart], {
              type: 'octet/stream',
            });
            const filename = res.headers
              .get('content-disposition')
              ?.split(';')[1]
              .split('=')[1]
              .replace(/"/g, '');
            saveAs(blob, filename);
            this.isExportInProgress = false;
          }
        },
        error: () => {
          this.isExportInProgress = false;
          this.errorMessage = 'There was an error while downloading the file';
        },
      });
  }

  clearFilters(): void {
    this.globalSearchText = '';
    this.tableFilters.emptyFilters();
    this.searchWithFilters();
  }

  checkIfFiltersAreEmpty(): void {
    this.emptyFilters = Boolean(
      this.tableFilters.checkIfFiltersAreEmpty() &&
        this.globalSearchText === ''
    );
  }

  clearGlobalSearch(): void {
    this.globalSearchText = '';
    this.requestParams.globalSearchInput = '';
    this.searchWithFilters();
  }

  getSortDirection(event: TableLazyLoadEvent | undefined): string | undefined {
    if (_isNilOrEmpty(event?.sortField)) {
      return undefined;
    } else {
      return event?.sortOrder === 1 ? SortDirectionEnum.ASC : SortDirectionEnum.DESC;
    }
  }

  buildParams(): Partial<ISystemDuplicatesRequestParams & SystemDuplicatesFilters> {
    const params: Partial<ISystemDuplicatesRequestParams & SystemDuplicatesFilters>= {
      ...this.tableFilters,
      ...this.requestParams,
      globalSearchInput: this.globalSearchText,
      origins: this.tableFilters?.selectedOrigin?.map((item: TableMultiselectOption) => item.value),
      vendorCodes: this.tableFilters?.selectedVendor?.map((item: TableMultiselectOption) => item.value),
      customerCodes: this.tableFilters?.selectedCustomer?.map((item: TableMultiselectOption) => item.value),
      categories: this.tableFilters?.selectedCategory?.map((item: TableMultiselectOption) => item.value),
      accountGroups: this.tableFilters?.selectedAccountGroup?.map((item: TableMultiselectOption) => item.value),
      bpGroupings: this.tableFilters?.selectedBpGrouping?.map((item: TableMultiselectOption) => item.value),
      oneTimeAccounts: this.tableFilters?.selectedOneTimeAcc?.map((item: TableMultiselectOption) => item.value),
      retrievedOn: this.datePipe.transform(this.tableFilters?.retrievedOn, 'yyyy-MM-dd') ?? '',
    };

    delete params.accountGroup;
    delete params.origin;
    delete params.vendor;
    delete params.customer;
    delete params.oneTimeAcc;
    delete params.category;

    delete params.selectedAccountGroup;
    delete params.selectedOrigin;
    delete params.selectedVendor;
    delete params.selectedCustomer;
    delete params.selectedOneTimeAcc;
    delete params.selectedCategory;
    delete params.selectedBpGrouping;

    return params;
  }
}
