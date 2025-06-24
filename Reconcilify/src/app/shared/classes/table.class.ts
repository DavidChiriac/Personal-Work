import { ActivatedRoute } from '@angular/router';
import { ILeaverReport } from '../../leavers/leaver-report/models/leaver-report.interface';
import { IColumn } from '../interfaces/column.interface';
import { SortDirectionEnum } from '../utils/sort-directions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { _isNilOrEmpty } from '../utils/lodash-utils';
import {
  Table,
  TableLazyLoadEvent,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
  TableSelectAllChangeEvent,
} from 'primeng/table';
import { SharedServiceService } from '../services/shared.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import saveAs from 'file-saver';
import { ILeaverReportAcknowledgement } from '../../leavers/leaver-report-acknowledgement/models/leaver-report-acknowledgement.interface';
import {
  IItemDto,
  IItemFilterDTO,
  IProduct,
} from '../../hierarchy-mapper/products-mapping/models/products-mapping-table.interface';
import { ProductsMappingFilters } from '../../hierarchy-mapper/products-mapping/models/products-mapping-table-filters';
import { LeaverReportFilters } from '../../leavers/leaver-report/models/leaver-report-table.filters';
import { ProductsMappingStatusEnum } from '../../hierarchy-mapper/products-mapping/models/products-mapping-status.enum';
import {
  IUserGroupDTO,
  IUserGroupFilters,
} from '../../administration/user-group-management/models/userGroupDTO.interface';
import { UserGroupFilters } from '../../administration/user-group-management/models/userGroup.filters';
import { LeaverReportAcknowledgementFilters } from '../../leavers/leaver-report-acknowledgement/models/leaver-report-acknowledgement-table.filters';
import { IRequestParams } from '../interfaces/request-params.interface';
import { acknowledgementGlobalFilters } from '../../leavers/leaver-report-acknowledgement/models/acknowledgement.global-filters';
import { quickFilters } from '../../hierarchy-mapper/products-mapping/quick-filters.contant';
import { InvalidReasonTypeEnum } from '../../hierarchy-mapper/products-mapping/models/invalidity-reason-type.enum';

type ITableData =
  | ILeaverReport
  | IProduct
  | IUserGroupDTO
  | ILeaverReportAcknowledgement;
type ITableFilters =
  | LeaverReportFilters
  | ProductsMappingFilters
  | UserGroupFilters
  | LeaverReportAcknowledgementFilters;
type ITableDataResponse =
  | {
      leavers: ILeaverReport[];
      leaverFilterCriteria: Partial<LeaverReportFilters>;
    }
  | { items: IItemDto[]; filter: Partial<IItemFilterDTO> }
  | { userFilterDTO: IUserGroupFilters; users: IUserGroupDTO[] }
  | {
      userAcknowledgementTaskViewDTO: ILeaverReportAcknowledgement[];
      taskFilterDTO: Partial<LeaverReportAcknowledgementFilters>;
    };

export interface IGlobalFilter {
  label: string;
  count?: number;
  status?: number | null;
  retrievedOnFrom?: string;
  retrievedOnTo?: string;
  id?: ProductsMappingStatusEnum;
}

@UntilDestroy()
export abstract class TableComponent {
  table!: Table;

  globalSearchText = '';
  tableData: ITableData[] = [];
  tableColumns: IColumn[] = [];
  tableFilters!: ITableFilters;

  globalFilters!: IGlobalFilter[];
  selectedQuickFilter!: IGlobalFilter;

  loading = false;
  totalRecords = 0;
  filterNames: string[] = [];
  emptyFilters = true;
  SortDirectionEnum = SortDirectionEnum;

  requestParams: IRequestParams = {
    pageSize: 0,
    pageNumber: 0,
    fieldToSort: null,
    sortDirection: null,
    globalSearchInput: '',
  };

  exportDialogVisible = false;
  exportModalVisible = false;
  time: number = 0;
  display = '00:00';
  interval: any;

  errorModalVisible = false;
  errorMessage = '';

  selectedEntriesList: Partial<ITableData>[] = [];
  selectedEntries: Partial<ITableData>[] = [];
  allSelected = false;

  queryParams: {
    retrievedOnFrom?: string;
    retrievedOnTo?: string;
    selectedSourceSystems?: string;
    invalidReason?: string;
    allTasks?: string;
    isBackdatedLeaver?: string;
    [key: string]: string | undefined;
  } = {
      retrievedOnFrom: undefined,
      retrievedOnTo: undefined,
      selectedSourceSystems: undefined,
      invalidReason: undefined,
      allTasks: undefined,
      isBackdatedLeaver: undefined,
    };

  statusEnum = ProductsMappingStatusEnum;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly sharedService: SharedServiceService
  ) {}

  ngOnInit(): void {
    this.getQueryParams();

    this.filterNames = this.tableColumns.map(
      (col) => col.filterField ?? col.field
    );

    this.getFilters();
  }

  onLazyLoad(event: TableLazyLoadEvent | string | undefined = undefined): void {
    if (typeof event === 'object') {
      this.updateRequestParamsFromEvent(event);
      this.normalizeTableFilters(event);
      this.specificFiltersAjustments();
    } else if (typeof event === 'string') {
      this.globalSearchText = event;
    }

    this.requestParams.globalSearchInput = this.globalSearchText;
    if (this.globalSearchText && this.tableFilters.filtersAreEmpty()) {
      this.globalSearch();
    } else {
      this.fetchTableData();
    }

    this.emptyFilters =
      this.tableFilters.filtersAreEmpty() &&
      !this.globalSearchText &&
      !this.requestParams.fieldToSort;
  }

  getQueryParams(): void {
    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      Object.keys(this.queryParams).forEach((key) => {
        this.queryParams[key.toString()] = params[key.toString()] ?? undefined;
      });

      window.history.replaceState({}, '', window.location.href.split('?')[0]);
    });
  }

  persistSelectedRows(): void {
    this.selectedEntriesList = [];

    if (_isNilOrEmpty(this.selectedEntries) === false) {
      this.tableData.forEach((row: ITableData) => {
        if (
          this.selectedEntries.findIndex(
            (entry: ITableData) => entry.id === row.id
          ) >= 0
        ) {
          this.selectedEntriesList.push(row);
          row._selected = true;
        }
      });
    } else {
      this.tableData.forEach((row: ITableData) => {
        row._selected = false;
      });
    }
    this.checkSelectAll();
  }

  normalizeTableFilters(event: TableLazyLoadEvent): void {
    const { filters } = event;

    if (filters) {
      this.processFilters(filters);
    }

    this.tableColumns.forEach((col) => {
      if (col.datepicker && col.dateRange) {
        this.adjustRangeDateFilter(col.filterField ?? col.field);
      } else if (col.datepicker) {
        this.adjustDateFilter(col.filterField ?? col.field);
      }
    });
  }

  specificFiltersAjustments(): void {
    this.adjustAcknowledgedFilter();
    this.adjustStatusFilter();
    this.applyNameCodeFilters();
    this.applyQueryParams();
  }

  adjustAcknowledgedFilter(): void {
    const acknowledged = this.tableFilters.selectedAcknowledged;

    if (acknowledged?.length) {
      this.selectedQuickFilter =
        acknowledged.length > 1
          ? acknowledgementGlobalFilters.allTasks
          : this.globalFilters?.find(
            (filter) => filter.status === acknowledged[0]
          ) ?? acknowledgementGlobalFilters.allTasks;
    }
  }

  adjustStatusFilter(): void {
    const status = this.tableFilters.selectedStatus;

    if (status?.length) {
      this.selectedQuickFilter =
        status.length > 1
          ? {
            label: quickFilters.allProducts,
            id: this.statusEnum['All Products'],
          }
          : this.globalFilters.find((filter) => filter.label === status[0]) ?? {
            label: quickFilters.allProducts,
            id: this.statusEnum['All Products'],
          };
    }
  }

  applyNameCodeFilters(): void {
    const codeNameFields = [
      'globalCategoryName',
      'globalGroupName',
      'globalSubgroupName',
      'localCategoryName',
      'localGroupName',
      'localSubgroupName',
      'proposedCategoryName',
      'proposedGroupName',
      'proposedSubgroupName',
    ];

    codeNameFields.forEach((field) => this.buildNameCodeFilters(field));
  }

  applyQueryParams(): void {
    const {
      selectedSourceSystems,
      invalidReason,
      retrievedOnFrom,
      retrievedOnTo,
      isBackdatedLeaver
    } = this.queryParams;

    if (selectedSourceSystems) {
      this.tableFilters.selectedSourceSystems = [selectedSourceSystems];
    }

    if (invalidReason) {
      this.applyInvalidReason(invalidReason);
      this.queryParams.invalidReason = undefined;
    }

    if (retrievedOnFrom) {
      this.tableFilters.retrievedOnFrom = retrievedOnFrom;
      this.tableFilters.retrievedOnTo = retrievedOnTo ?? retrievedOnFrom;
    }

    if(isBackdatedLeaver) {
      this.tableFilters.selectedBackdatedLeaver = [true];
    }
  }

  applyInvalidReason(reason: string): void {
    switch (reason) {
    case 'incorrect':
      this.tableFilters.invalidityReasonTypes = [
        InvalidReasonTypeEnum.INCORRECT_CODE_NAME_RELATIONSHIP,
        InvalidReasonTypeEnum.INCORRECT_NAME_VALUE,
        InvalidReasonTypeEnum.LEVEL_RELATIONSHIP_MISMATCH,
      ];
      break;
    case 'missing':
      this.tableFilters.invalidityReasonTypes = [
        InvalidReasonTypeEnum.MISSING_CLASSIFICATION_CODE,
        InvalidReasonTypeEnum.MISSING_CLASSIFICATION_NAME,
      ];
      break;
    default:
      this.tableFilters.invalidityReasonTypes = null;
      break;
    }
  }

  buildNameCodeFilters(fieldName: string): void {
    const codeFieldName = fieldName.slice(0, -4) + 'Code';
    const globalCategory = this.tableFilters[fieldName]?.split('-');
    if(this.tableFilters[fieldName]){
      this.tableFilters[fieldName] = null;
    }
    if (globalCategory?.length === 1) {
      if (/^\d+$/.test(globalCategory[0])) {
        this.tableFilters[codeFieldName] = globalCategory[0].trim();
      } else {
        this.tableFilters[fieldName] = globalCategory[0].trim();
      }
    } else if (globalCategory && globalCategory?.length > 1) {
      this.tableFilters[fieldName] = globalCategory[1].trim();
      this.tableFilters[codeFieldName] = globalCategory[0].trim();
    } else if(this.tableFilters[codeFieldName]){
      this.tableFilters[codeFieldName] = null;
    }
  }

  checkSelectAll(): void {
    if (this.selectedEntries.length === this.totalRecords) {
      this.allSelected = true;
    } else {
      this.allSelected = false;
    }
  }

  updateRequestParamsFromEvent(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? 20;
    this.requestParams.pageNumber = (event.first ?? 0) / rows;
    this.requestParams.pageSize = rows;
  }

  processFilters(filters: Record<string, any>): void {
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        this.tableFilters[key] = value[0]?.value ?? null;
      } else if (value?.value) {
        this.tableFilters[key] = value.value;
      }
    }
  }

  adjustRangeDateFilter(filterKey: string): void {
    const dateStr = this.tableFilters[filterKey];

    if (dateStr) {
      if (Array.isArray(dateStr)) {
        this.tableFilters[filterKey + 'From'] =
          this.sharedService.formatDateFilters(dateStr[0]);

        if (dateStr[1]) {
          this.tableFilters[filterKey + 'To'] =
            this.sharedService.formatDateFilters(dateStr[1]);
        } else {
          this.tableFilters[filterKey + 'To'] =
            this.sharedService.formatDateFilters(dateStr[0]);
        }
      } else {
        this.tableFilters[filterKey + 'From'] =
          this.sharedService.formatDateFilters(dateStr);
        this.tableFilters[filterKey + 'To'] =
          this.sharedService.formatDateFilters(dateStr);
      }
    } else {
      this.tableFilters[filterKey + 'From'] = null;
      this.tableFilters[filterKey + 'To'] = null;
    }
  }

  adjustDateFilter(filterKey: string): void {
    const dateStr = this.tableFilters[filterKey];
    if (dateStr) {
      const date = new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      this.tableFilters[filterKey] = date;
    }
  }

  toggleExportDialog(): void {
    this.exportDialogVisible = !this.exportDialogVisible;
  }

  toggleErrorModal(): void {
    this.errorModalVisible = !this.errorModalVisible;
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      this.time += 1;
      this.display = this.transform(this.time);
    }, 1000);
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      (minutes < 10 ? `0${minutes}` : minutes) +
      ':' +
      (value - minutes * 60 < 10
        ? `0${value - minutes * 60}`
        : value - minutes * 60)
    );
  }

  stopTimer(): void {
    clearInterval(this.interval);
    this.time = 0;
    this.display = '00:00';
  }

  onSort(event: { field: string; event: Event }): void {
    event.event.stopPropagation();
    if (this.requestParams.fieldToSort === event.field) {
      if (this.requestParams.sortDirection === SortDirectionEnum.ASC) {
        this.requestParams.sortDirection = SortDirectionEnum.DESC;
      } else {
        this.requestParams.sortDirection = SortDirectionEnum.None;
        this.requestParams.fieldToSort = '';
      }
    } else {
      this.requestParams.fieldToSort = event.field;
      this.requestParams.sortDirection = SortDirectionEnum.ASC;
    }
    this.onLazyLoad();
  }

  handleErrorResponse(): void {
    this.loading = false;
  }

  handleDataResponse(data: ITableDataResponse): void {
    this.populateTableData(data);
    this.persistSelectedRows();
  }

  handleFetchCompletion(): void {
    let queryParamsExist = false;

    Object.values(this.queryParams).forEach((value) => {
      if (value) {
        queryParamsExist = true;
      }
    });

    if (queryParamsExist) {
      this.applyQueryParamsFilters();
    }
    this.loading = false;
  }

  selectQuickFilter(filter: {
    label: string;
    retrievedOnFrom?: string;
    retrievedOnTo?: string;
    id?: ProductsMappingStatusEnum;
  }): void {
    this.selectedQuickFilter = filter;

    if (filter.retrievedOnFrom && filter.retrievedOnTo) {
      this.tableFilters.retrievedOn = null;

      this.tableFilters.retrievedOnFrom = filter.retrievedOnFrom ?? null;
      this.tableFilters.retrievedOnTo = filter.retrievedOnTo ?? null;

      this.table.filters['retrievedOn'] = [
        {
          value: [
            new Date(filter.retrievedOnFrom),
            new Date(filter.retrievedOnTo),
          ],
          matchMode: 'in',
          operator: 'and',
        },
      ];
    } else {
      this.tableFilters.retrievedOnFrom = null;
      this.tableFilters.retrievedOnTo = null;

      this.table.filters['retrievedOn'] = [
        {
          value: null,
          matchMode: 'in',
          operator: 'and',
        },
      ];
    }

    this.onLazyLoad();
  }

  clearFilters(): void {
    this.table.clearFilterValues();
    this.globalSearchText = '';
    this.requestParams.fieldToSort = '';
    this.tableFilters.emptyFilters();
  }

  clearGlobalSearchText(): void {
    this.globalSearchText = '';
    this.globalSearch();
  }

  onRowSelect(event: TableRowSelectEvent): void {
    if (this.selectedEntriesList.length === this.totalRecords) {
      this.allSelected = true;
    }

    this.selectedEntries.push({ id: event.data.id });
    this.changeRowColor(event.data.id, true);
  }

  onRowUnselect(event: TableRowUnSelectEvent<ITableData>): void {
    this.allSelected = false;
    let eventId = -1;
    if(Array.isArray(event.data)){
      eventId = event.data[0].id ?? -1;
    } else {
      eventId = event.data?.id ?? -1;
    }
    this.selectedEntries = this.selectedEntries.filter((entry) => {
      if(Array.isArray(event.data)){
        return entry.id !== event.data[0].id;
      }
      return entry.id !== event.data?.id;
    });
    this.selectedEntriesList = this.selectedEntriesList.filter((entry) => {
      if(Array.isArray(event.data)){
        return entry.id !== event.data[0].id;
      }
      return entry.id !== event.data?.id;
    });

    this.changeRowColor(eventId, false);
  }

  changeRowColor(rowId: number, selected?: boolean): void {
    this.tableData.forEach((row: ITableData) => {
      if (row.id === rowId) {
        row._selected = selected;
      }
    });
  }

  applyQueryParamsFilters(): void {
    Object.entries(this.queryParams).forEach(([key, value]) => {
      if (value) {
        this.table.filters[key.toString()] = [
          {
            value: [value],
            matchMode: 'in',
            operator: 'and',
          },
        ];

        this.queryParams[key.toString()] = undefined;
      }
    });
  }

  onSelectAllChange(event: TableSelectAllChangeEvent): void {
    this.allSelected = event.checked;
    if (event.checked === true) {
      this.loading = true;
      this.selectAll({
        ...this.requestParams,
        ...this.tableFilters,
      })
        .pipe(untilDestroyed(this))
        .subscribe((selectedList) => {
          this.selectedEntries = selectedList.map((entry) => {
            return { id: entry };
          });
          this.selectedEntriesList = this.selectedEntries;
          this.persistSelectedRows();
          this.loading = false;
        });
    } else {
      this.selectedEntries = [];
      this.selectedEntriesList = [];
      this.persistSelectedRows();
    }
  }

  exportData(exportAll: boolean = false): void {
    this.toggleExportDialog();
    if (
      (exportAll && this.totalRecords > 1000) ||
      (!exportAll && this.selectedEntries.length > 1000)
    ) {
      this.exportModalVisible = true;
      this.startTimer();
    }

    if (!exportAll && this.selectedEntries.length > 10000) {
      this.errorMessage =
        '10.000 records or more are selected. The maximum limit is 10.000';
      this.toggleErrorModal();
    } else {
      this.loading = true;
      this.exportTableData(
        {
          ...this.requestParams,
          ...this.tableFilters,
        },
        exportAll ? null : this.selectedEntries
      )
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
            }
            this.loading = false;
            this.exportModalVisible = false;
            this.stopTimer();
          },
          error: (error: {
            error: { text: () => Promise<string> };
            status: number;
          }) => {
            if (error.error instanceof Blob && error.status === 400) {
              error.error.text().then((text: string) => {
                this.errorMessage = JSON.parse(text).message;
              });
            } else {
              this.errorMessage =
                'There was an error while downloading the file';
            }
            this.loading = false;
            this.errorModalVisible = true;
            this.exportModalVisible = false;
            this.stopTimer();
          },
        });
    }
  }

  protected abstract globalSearch(event?: string): void;
  protected abstract fetchTableData(): void;
  protected abstract getFilters(): void;
  protected abstract populateTableData(data: ITableDataResponse): void;
  protected abstract selectAll(
    params: Partial<IRequestParams> & Partial<ITableFilters>
  ): Observable<number[]>;
  protected abstract exportTableData(
    params: Partial<IRequestParams> & Partial<ITableFilters>,
    selectedItems: Partial<ITableData>[] | null
  ): Observable<HttpResponse<object>>;
}
