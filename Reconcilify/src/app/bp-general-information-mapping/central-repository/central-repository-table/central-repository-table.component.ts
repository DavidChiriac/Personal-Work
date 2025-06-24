/* eslint-disable max-lines */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CentralRepositoryColumns } from './models/central-repository-table.columns';
import { CentralRepositoryFilters } from './models/central-repository-table-filters';
import { CentralRepositoryService } from '../central-repository.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  IVendorCustomer,
  IVendorCustomerFilters,
  IVendorCustomerPrefilledParams,
  IVendorCustomerRequestParams,
  IVendorCustomerStatusBadge,
} from './models/central-repository-table.interface';
import { LazyLoadEvent } from 'primeng/api';
import {
  Table,
  TableRowSelectEvent,
  TableSelectAllChangeEvent,
} from 'primeng/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { HttpResponse } from '@angular/common/http';
import { SessionStorageService } from 'ngx-webstorage';
import { delay } from 'rxjs';
import { DatePipe, DecimalPipe } from '@angular/common';
import { vendorCustomerStatus } from '../../../shared/constants/vendor-customer-status.constant';
import { DisplayService } from '../../../shared/services/display.service';
import { TableMultiselectOption } from '../../../shared/utils/table-filters-utils';
import { _isNilOrEmpty } from '../../../shared/utils/lodash-utils';
import { categoryStartCfin } from '../../../shared/constants/category-start-cfin.constant';
import { SortDirectionEnum } from '../../../shared/utils/sort-directions';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-central-repository-table',
  templateUrl: './central-repository-table.component.html',
  styleUrl: './central-repository-table.component.scss',
  providers: [DatePipe, DecimalPipe],
  standalone: false
})
export class CentralRepositoryTableComponent implements OnInit, AfterViewInit {
  @ViewChild(Table) tableRef!: Table;

  tableData: IVendorCustomer[] = [];
  tableColumns = CentralRepositoryColumns.getColumns();
  tableFilters: CentralRepositoryFilters = new CentralRepositoryFilters();
  requestParams!: IVendorCustomerRequestParams;
  totalRecords: number = 0;
  first: number = 0;
  rowsPerPage: number = 20;
  selectedRows: IVendorCustomer[] = [];
  selectedRowsList: {id: string, status: string, cfinCode: number, category: string, bpGrouping: string, accountGroup: string}[] = [];
  allSelected: boolean = false;
  globalSearchText: string = '';
  tableHeight!: number;
  loading: boolean = false;
  filtersLoading = false;
  vendorCustomerStatus = vendorCustomerStatus;
  toggleStatus: IVendorCustomerStatusBadge = {
    newWithoutCfin: {
      selected: false,
      badge: '',
    },
    newWithCfin: {
      selected: false,
      badge: '',
    },
    mapped: {
      selected: false,
      badge: '',
    },
    approved: {
      selected: false,
      badge: '',
    },
  };
  emptyFilters!: boolean;
  isExportInProgress: boolean = false;
  isExportCfinInProgress: boolean = false;
  errorModalVisible: boolean = false;
  deleteRecordVisible = false;
  deletedRecord!: string;
  isDeleting = false;

  canMassApprove = false;
  canMassDelete = false;
  canExportForCfin = false;
  approveModalVisible = false;
  massDeleteModalVisible = false;
  approveComment = '';
  newWithCfin: boolean | undefined = undefined;

  isAnyCfinInvalid = false;

  errorMessage = '';

  constructor(
    private readonly centralRepositoryService: CentralRepositoryService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly displayService: DisplayService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly datePipe: DatePipe,
    private readonly decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    this.firstSearch(() => {
      this.getTableFilters();
    });
  }

  defaultSearch(afterComplete?: () => void): void {
    const reqParamsStatuses: string[] = [];
    const selectedStatuses: TableMultiselectOption[] = [];

    if (this.tableFilters.status.length > 0) {
      this.tableFilters.status.forEach((status) => {
        if (status.value === this.vendorCustomerStatus.new) {
          reqParamsStatuses.push(this.vendorCustomerStatus.new);
          selectedStatuses.push({ value: this.vendorCustomerStatus.new });
        }
        if (status.value === this.vendorCustomerStatus.approved) {
          reqParamsStatuses.push(this.vendorCustomerStatus.approved);
          selectedStatuses.push({ value: this.vendorCustomerStatus.approved });
        }
      });
    }

    this.requestParams = {
      ...this.requestParams,
      statuses: reqParamsStatuses,
    };
    this.tableFilters.selectedStatus = selectedStatuses;
    this.onLazyLoad(null, true, afterComplete);
  }

  firstSearch(afterComplete?: () => void): void {
    this.route.queryParams
      .pipe(untilDestroyed(this))
      .subscribe((prefilledParams: Params) => {
        if (!_isNilOrEmpty(prefilledParams)) {
          if (prefilledParams['status'] === this.vendorCustomerStatus.total) {
            this.onLazyLoad(null, true);
            afterComplete?.();
          } else {
            this.searchWithPrefilledParams(
              prefilledParams as IVendorCustomerPrefilledParams,
              afterComplete
            );
          }
        } else {
          this.defaultSearch(afterComplete);
        }
      });
  }

  ngAfterViewInit(): void {
    this.displayService.contentHeight$
      .pipe(untilDestroyed(this), delay(0))
      .subscribe((height) => {
        this.tableHeight = height;
      });
  }

  onLazyLoad(event?: any, goToFirstPage: boolean = false, afterComplete?: () => void): void {
    this.getRequestParams(event, goToFirstPage);
    this.getTableData(afterComplete);
  }

  getTableData(afterComplete?: () => void): void {
    this.loading = true;
    this.centralRepositoryService
      .getVendorCustomerData(this.requestParams)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.first = data.filters.pageNumber * data.filters.pageSize;
        this.rowsPerPage = data.filters.pageSize;
        this.tableData = [...data.centralData];
        this.totalRecords = data.filters.numberOfRecords;

        this.tableData.forEach((row: IVendorCustomer) => {
          row.retrievedOn = row.retrievedOn?.substring(0, 10);
          row.exportedOn = row.exportedOn?.substring(0, 10);
          row.updatedOn = row.updatedOn?.substring(0, 10);
        });
        this.loading = false;
        this.persistSelectedRows();
        afterComplete?.();
      });
  }

  getTableFilters(refreshCounter = false): void {
    this.filtersLoading = true;
    this.centralRepositoryService
      .getVendorCustomerDataFilters()
      .pipe(untilDestroyed(this))
      .subscribe((data: Partial<IVendorCustomerRequestParams>) => {
        this.sessionStorageService.store('filtersOptions', data);
        this.setStatusBadge(data);

        if(!refreshCounter){
          this.tableFilters = this.centralRepositoryService.createFilters(data as CentralRepositoryFilters);
        }
        
        this.filtersLoading = false;
      });
  }

  setStatusBadge(data: Partial<IVendorCustomerRequestParams>): void {
    this.toggleStatus.newWithoutCfin.badge =
      this.decimalPipe
        .transform(data.statusCountDTO?.['newWithoutCfinCount'] ?? 0)
        ?.toString() ?? '';
    this.toggleStatus.newWithCfin.badge =
      this.decimalPipe
        .transform(data.statusCountDTO?.['newWithCfinCount'] ?? 0)
        ?.toString() ?? '';
    this.toggleStatus.mapped.badge =
      this.decimalPipe
        .transform(data.statusCountDTO?.['mappedCount'] ?? 0)
        ?.toString() ?? '';
    this.toggleStatus.approved.badge =
      this.decimalPipe
        .transform(data.statusCountDTO?.['approvedCount'] ?? 0)
        ?.toString() ?? '';
  }

  searchWithPrefilledParams(params: IVendorCustomerPrefilledParams, afterComplete?: () => void): void {
    const requestParams = {
      pageSize: this.rowsPerPage,
      pageNumber: 0,
      fieldToSort: null,
      sortDirection: null,
      globalSearchInput: this.globalSearchText,
      statuses: [params.status],
      origins: [params.origin],
    };

    this.requestParams = requestParams;
    this.getTableData(afterComplete);
    this.tableFilters.selectedStatus = [{ value: params.status }];
    this.tableFilters.selectedOrigin = [{ value: params.origin }];
    const statusKey = params.status.toLowerCase() as keyof typeof this.toggleStatus;
    if (statusKey in this.toggleStatus) {
      this.toggleStatus[statusKey].selected = true;
    }
  }

  showByStatus(status: string, hasCfin?: boolean): void {
    switch (status) {
    case this.vendorCustomerStatus.new:
      if((hasCfin === true && this.toggleStatus.newWithCfin.selected === false) ||
        (hasCfin === false && this.toggleStatus.newWithoutCfin.selected === false)){
        this.selectedRows = [];
        this.selectedRowsList = [];
        this.globalSearchText = '';
        this.allSelected = false;

        this.tableFilters.emptyFilters();
      }
      this.toggleStatus.newWithoutCfin.selected = hasCfin === false;
      this.toggleStatus.newWithCfin.selected = hasCfin === true;
      this.toggleStatus.mapped.selected = false;
      this.toggleStatus.approved.selected = false;
      this.newWithCfin = hasCfin;
      this.searchByStatus(this.vendorCustomerStatus.new);
      break;
    case this.vendorCustomerStatus.mapped:
      if(this.toggleStatus.mapped.selected === false){
        this.selectedRows = [];
        this.selectedRowsList = [];
        this.globalSearchText = '';
        this.allSelected = false;

        this.tableFilters.emptyFilters();
      }
      this.toggleStatus.newWithoutCfin.selected = false;
      this.toggleStatus.newWithCfin.selected = false;
      this.toggleStatus.mapped.selected = true;
      this.toggleStatus.approved.selected = false;
      this.newWithCfin = undefined;
      this.searchByStatus(this.vendorCustomerStatus.mapped);
      break;
    case this.vendorCustomerStatus.approved:
      if(this.toggleStatus.approved.selected === false){
        this.selectedRows = [];
        this.selectedRowsList = [];
        this.globalSearchText = '';
        this.allSelected = false;

        this.tableFilters.emptyFilters();
      }
      this.toggleStatus.newWithoutCfin.selected = false;
      this.toggleStatus.newWithCfin.selected = false;
      this.toggleStatus.mapped.selected = false;
      this.toggleStatus.approved.selected = true;
      this.newWithCfin = undefined;
      this.searchByStatus(this.vendorCustomerStatus.approved);
      break;
    default:
      this.toggleStatus.newWithoutCfin.selected = false;
      this.toggleStatus.newWithCfin.selected = false;
      this.toggleStatus.mapped.selected = false;
      this.toggleStatus.approved.selected = false;
      this.newWithCfin = undefined;
      this.getTableData();
      break;
    }
  }

  searchByStatus(status: string): void {
    const requestParams = {
      pageSize: this.rowsPerPage,
      pageNumber: 0,
      fieldToSort: null,
      sortDirection: null,
      hasCfin: this.newWithCfin,
      globalSearchInput: this.globalSearchText,
      statuses: [status],
    };
    this.requestParams = requestParams;
    this.tableFilters.selectedStatus = [{ value: status }];
    this.getTableData();
  }

  onSelectAllChange(event: TableSelectAllChangeEvent): void {
    this.allSelected = event.checked;
    if (this.allSelected) {
      this.selectedRowsList = [];
      this.centralRepositoryService
        .selectAllVendorsCustomerRows(this.requestParams)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          this.selectedRowsList = data.map((record: {id: string, status: string, cfinCode: number, category: string, bpGrouping: string, accountGroup: string}) => {return {id: record.id, status: record.status, cfinCode: record.cfinCode, category: record.category, bpGrouping: record.bpGrouping, accountGroup: record.accountGroup};});
          
          this.validateCfinOfSelectedRecords();
          this.checkSelectedList();
          this.persistSelectedRows();
          this.checkIfFiltersAreEmpty();
        });
    } else {
      this.selectedRowsList = [];
      this.persistSelectedRows();
      this.checkIfFiltersAreEmpty();
    }
  }

  onRowSelect(event: TableRowSelectEvent): void {
    if (_isNilOrEmpty(this.selectedRowsList)) {
      this.selectedRowsList = [];
    }
    if (
      this.selectedRowsList.findIndex((record: {id: string, status: string, cfinCode: number, category: string, bpGrouping: string, accountGroup: string}) => record.id === event.data.id) < 0
    ) {
      this.selectedRowsList.push({id: event.data.id, status: event.data.status, cfinCode: event.data.cfinCode, category: event.data.category, bpGrouping: event.data?.bpGrouping, accountGroup: event.data?.accountGroup});

      if(this.canMassApprove){
        this.canMassApprove = (event.data.status === vendorCustomerStatus.new && Boolean(event.data.cfinCode) && Boolean(event.data.category) && Boolean(event.data.bpGrouping) && Boolean(event.data.accountGroup));
      } else {
        this.checkIfCanMassApprove();
      }

      if(this.canMassDelete){
        this.canMassDelete = (event.data.status === vendorCustomerStatus.new);
      } else {
        this.checkIfCanMassDelete();
      }

      if(this.canExportForCfin){
        this.canExportForCfin = (event.data.status !== vendorCustomerStatus.new);
      } else {
        this.checkIfCanExportForCfin();
      }
    }
    this.checkSelectAll();
    this.validateCfinOfSelectedRecords();
    this.changeRowColor(event.data.id, true);
    this.checkIfFiltersAreEmpty();
  }

  onRowUnselect(event: TableRowSelectEvent): void {
    const index = this.selectedRowsList.findIndex(
      (record: {id: string}) => record.id === event.data.id
    );
    if (index >= 0) {
      this.selectedRowsList.splice(index, 1);
    }
    this.allSelected = false;

    if (_isNilOrEmpty(this.selectedRows) === false) {
      this.selectedRows.forEach((row: IVendorCustomer) => {
        if (this.selectedRowsList.findIndex((record: {id: string, status: string, cfinCode: number}) => record.id === row.id.toString()) < 0) {
          this.selectedRowsList.push({id: row.id.toString(), status: row.status, cfinCode: row.cfinCode, category: row.category, bpGrouping: row.bpGrouping, accountGroup: row.accountGroup});
        }
      });
    }
    this.validateCfinOfSelectedRecords();
    this.checkSelectedList();
    this.changeRowColor(event.data.id, false);
    this.checkIfFiltersAreEmpty();
  }

  checkSelectedList(): void{
    this.checkIfCanMassApprove();
    this.checkIfCanMassDelete();
    this.checkIfCanExportForCfin();
  }

  checkIfCanMassApprove(): void {
    for(const record of this.selectedRowsList){
      if(record.status !== vendorCustomerStatus.new || !record.cfinCode || !record.category || !record.bpGrouping || !record.accountGroup){
        this.canMassApprove = false;
        return;
      }
    }
    this.canMassApprove = true;
  }

  checkIfCanMassDelete(): void {
    for(const record of this.selectedRowsList){
      if(record.status !== vendorCustomerStatus.new){
        this.canMassDelete = false;
        return;
      }
    }
    this.canMassDelete = true;
  }

  checkIfCanExportForCfin(): void {
    for(const record of this.selectedRowsList){
      if(record.status === vendorCustomerStatus.new){
        this.canExportForCfin = false;
        return;
      }
    }
    this.canExportForCfin = true;
  }

  validateCfinOfSelectedRecords(): void {
    const categoryMap = new Map(Object.values(categoryStartCfin).map(category => [category.name, category.start.toString()]));

    for (const record of this.selectedRowsList) {
      const startCfin = categoryMap.get(record.category);
      if ((startCfin && !record.cfinCode?.toString().startsWith(startCfin)) || !record.cfinCode) {
        this.isAnyCfinInvalid = true;
        return;
      }
    }

    this.isAnyCfinInvalid = false;
  }

  changeRowColor(rowId: string, selected?: boolean): void {
    this.tableData.forEach((row: IVendorCustomer) => {
      if (row.id === rowId) {
        row._selected = Boolean(selected);
      }
    });
  }

  persistSelectedRows(): void {
    this.selectedRows = [];

    if (_isNilOrEmpty(this.selectedRowsList) === false) {
      this.tableData.forEach((row: IVendorCustomer) => {
        if (this.selectedRowsList.findIndex((record: {id: string, status: string, cfinCode: number}) => record.id === row.id.toString()) >= 0) {
          row._selected = true;
          this.selectedRows.push(row);
        }
      });
    } else {
      this.tableData.forEach((row: IVendorCustomer) => {
        row._selected = false;
      });
    }
    this.checkSelectAll();
  }

  checkSelectAll(): void {
    if (this.selectedRowsList.length === this.totalRecords) {
      this.allSelected = true;
    } else {
      this.allSelected = false;
    }
    this.checkIfFiltersAreEmpty();
  }

  onMultiselectSelectionChange(
    selectedItems: Partial<IVendorCustomer>[],
    field: string
  ): void {
    this.tableFilters[field] = selectedItems;
    if(field === 'selectedStatus'){
      this.newWithCfin = undefined;
      this.toggleStatus.approved.selected = false;
      this.toggleStatus.newWithCfin.selected = false;
      this.toggleStatus.newWithoutCfin.selected = false;
      this.toggleStatus.mapped.selected = false;
    }
  }

  editRow(row: number, index: number): void {
    this.sessionStorageService.store('filters', {...this.prepareFiltersParams(), ...this.requestParams});
    this.sessionStorageService.store('recordViewClosed', false);
    this.sessionStorageService.store('totalNumberOfRecords', this.totalRecords);
    this.sessionStorageService.store('currentRecordIndex', index + 1);
    this.router.navigate(['edit', row], { relativeTo: this.route });
  }

  showDeleteDialog(id: string): void {
    this.deletedRecord = id;
    this.deleteRecordVisible = true;
  }

  closeDeleteDialog(): void {
    this.deleteRecordVisible = false;
    this.massDeleteModalVisible = false;
  }

  deleteRow(): void {
    this.isDeleting = true;
    this.centralRepositoryService
      .deleteRecord(this.deletedRecord)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.getTableData();
        },
        error: () => {
          alert('Error deleting record');
        },
        complete: () => {
          this.isDeleting = false;
          this.closeDeleteDialog();
        }
      });
  }

  exportTableData(): void {
    const reqParams = {
      ...this.requestParams,
      pageSize: null,
      pageNumber: null,
      isFirstPage: null,
      isLastPage: null,
      numberOfPages: null,
      numberOfRecords: null,
    };
    this.isExportInProgress = true;
    this.centralRepositoryService
      .exportVendorsCustomerData(reqParams)
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
          this.errorModalVisible = true;
        },
      });
  }

  exportCfin(): void {
    const selectedRows = [this.selectedRowsList.map((record) => record.id).toString()];
    this.isExportCfinInProgress = true;
    this.centralRepositoryService
      .exportCfinData(selectedRows)
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
            this.isExportCfinInProgress = false;
            this.getTableFilters();
            this.getTableData();
          }
        },
        error: () => {
          this.isExportCfinInProgress = false;
          this.errorMessage = 'There was an error while exporting';
          this.errorModalVisible = true;
        },
      });
  }

  clearFilters(): void {
    this.selectedRows = [];
    this.selectedRowsList = [];
    this.globalSearchText = '';
    this.allSelected = false;
    this.toggleStatus.newWithoutCfin.selected = false;
    this.toggleStatus.newWithCfin.selected = false;
    this.toggleStatus.mapped.selected = false;
    this.toggleStatus.approved.selected = false;
    this.newWithCfin = undefined;
    this.tableFilters.reset();
    this.tableRef.reset();
    this.getTableFilters();
  }

  checkIfFiltersAreEmpty(): void {
    this.emptyFilters =
      Boolean(this.tableFilters.checkIfFiltersAreEmpty() &&
      this.globalSearchText === '' &&
      this.allSelected === false &&
      this.selectedRowsList.length === 0 &&
      this.selectedRows.length === 0);
  }

  clearGlobalSearch(): void {
    this.globalSearchText = '';
    this.requestParams.globalSearchInput = '';
    this.getTableData();
  }

  getRequestParams(
    event?: LazyLoadEvent,
    goToFirstPage: boolean = false
  ): void {
    if (goToFirstPage) {
      this.resetPagination();
    } else if (!_isNilOrEmpty(event)) {
      this.setupPagination(event);
    } else {
      this.resetPagination();
    }
  }

  setupPagination(event: LazyLoadEvent | undefined): void {
    let requestParams: any = {};
    const filters = this.prepareFiltersParams();
    requestParams.pageSize = event?.rows ?? 20;
    requestParams.pageNumber = Math.floor(
      (event?.first ?? 0) / (event?.rows ?? 20)
    );
    requestParams.fieldToSort = event?.sortField ?? null;
    requestParams.sortDirection = this.getSortDirection(event);
    requestParams.globalSearchInput = this.globalSearchText;
    requestParams.hasCfin = this.newWithCfin;

    if(this.sessionStorageService.retrieve('filters')){
      requestParams = { ...requestParams, ...filters };
    } else {
      requestParams = { ...filters, ...requestParams};
    }

    this.requestParams = requestParams;
  }

  getSortDirection(event: LazyLoadEvent | undefined): string | null {
    if (_isNilOrEmpty(event?.sortField)) {
      return null;
    } else {
      return event?.sortOrder === 1 ? SortDirectionEnum.ASC : SortDirectionEnum.DESC;
    }
  }

  resetPagination(): void {
    const filters = this.prepareFiltersParams();
    const requestParams = {
      pageSize: 20,
      pageNumber: 0,
      fieldToSort: null,
      sortDirection: null,
      globalSearchInput: this.globalSearchText,
      ...filters,
    };

    if(this.requestParams?.hasCfin !== undefined){
      const auxHasCfin = this.requestParams.hasCfin;
      this.requestParams = {...requestParams, hasCfin: auxHasCfin};
    } else {
      this.requestParams = requestParams;
      this.toggleStatus.newWithoutCfin.selected = false;
      this.toggleStatus.newWithCfin.selected = false;
      this.toggleStatus.mapped.selected = false;
      this.toggleStatus.approved.selected = false;
    }
  }

  prepareFiltersParams(): IVendorCustomerFilters {
    const preselectedFilters = this.sessionStorageService.retrieve('filters');
    this.sessionStorageService.clear('filters');

    let selectedStatus = this.tableFilters.selectedStatus?.map((status) => status.value?.toString());
    let selectedMatching = this.tableFilters.selectedMatching?.map((matching) => matching.value?.toString());
    let selectedOrigin = this.tableFilters.selectedOrigin?.map((origin) =>origin.value?.toString());
    let selectedVendor = this.tableFilters.selectedVendor?.map((vendor) => vendor.value);
    let selectedCustomer = this.tableFilters.selectedCustomer?.map((customer) => customer.value);
    let selectedOneTimeAcc = this.tableFilters.selectedOneTimeAcc?.map((oneTimeAcc) => oneTimeAcc.value);
    let selectedCategory = this.tableFilters.selectedCategory?.map((category) => category.value?.toString());
    let selectedBpGrouping = this.tableFilters.selectedBpGrouping?.map((bpGrouping) => bpGrouping.value?.toString());
    let selectedAccountGroup = this.tableFilters.selectedAccountGroup?.map((accountGroup) => accountGroup.value?.toString());

    const cameFromRecordView = this.sessionStorageService.retrieve('recordViewClosed');
    if(preselectedFilters && cameFromRecordView) {
      selectedStatus = preselectedFilters.statuses?.map((status: string) => status?.toString());
      selectedMatching = preselectedFilters.matchings?.map((matching: string) => matching?.toString());
      selectedOrigin = preselectedFilters.origins?.map((origin: string) => origin?.toString());
      selectedVendor = preselectedFilters.vendorCodes?.map((vendor: string) => vendor?.toString()); 
      selectedCustomer = preselectedFilters.customerCodes?.map((customer: string) => customer?.toString());
      selectedOneTimeAcc = preselectedFilters.oneTimeAccounts?.map((customer: string) => customer?.toString());
      selectedCategory = preselectedFilters.categories?.map((category: string) => category?.toString()); 
      selectedBpGrouping = preselectedFilters.bpGroupings?.map((bpGroup: string) => bpGroup?.toString()); 
      selectedAccountGroup = preselectedFilters.accountGroups?.map((accountGroup: string) => accountGroup?.toString()); 
    
      this.tableFilters.selectedStatus = selectedStatus?.map((status: string)=>{return {value: status};});
      this.tableFilters.selectedMatching = selectedMatching?.map((matching: string)=>{return {value: matching};});
      this.tableFilters.selectedOrigin = selectedOrigin?.map((origin: string)=>{return {value: origin};});
      this.tableFilters.selectedVendor = selectedVendor?.map((vendor: string)=>{return {value: vendor};});
      this.tableFilters.selectedCustomer = selectedCustomer?.map((customer: string)=>{return {value: customer};});
      this.tableFilters.selectedOneTimeAcc = selectedOneTimeAcc?.map((oneTimeAcc: string)=>{return {value: oneTimeAcc};});
      this.tableFilters.selectedCategory = selectedCategory?.map((category: string)=>{return {value: category};});
      this.tableFilters.selectedBpGrouping = selectedBpGrouping?.map((bpGrouping: string)=>{return {value: bpGrouping};});
      this.tableFilters.selectedAccountGroup = selectedAccountGroup?.map((accountGroup: string)=>{return {value: accountGroup};});

      for(const [key, value] of Object.entries(preselectedFilters)){
        if(value){
          this.tableFilters[key] = value;
        }
      }
    }

    const filters = {
      ...this.tableFilters,
      statuses: selectedStatus,
      matchings: selectedMatching,
      origins: selectedOrigin,
      vendorCodes: selectedVendor,
      customerCodes: selectedCustomer,
      categories: selectedCategory,
      bpGroupings: selectedBpGrouping,
      accountGroups: selectedAccountGroup,
      oneTimeAccounts: selectedOneTimeAcc,
      retrievedOn: this.formatDateFilters(this.tableFilters.retrievedOn),
      exportedOn: this.formatDateFilters(this.tableFilters.exportedOn),
      updatedOn: this.formatDateFilters(this.tableFilters.updatedOn),
    };
    this.tableFilters.refineFiltersDataForRequestBody(filters);
    return filters;
  }

  formatDateFilters(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }

  toggleErrorModal(): void {
    this.errorModalVisible = !this.errorModalVisible;
    if(!this.errorModalVisible){
      this.errorMessage = '';
    }
  }

  massApprove(): void {
    if(this.isAnyCfinInvalid) {
      this.errorMessage = 'The record(s) cannot be mass approved because one or more of the selected records have invalid CFIN Code(s) for the assigned Category(ies). Please review!';
      this.errorModalVisible = true;
    } else {
      this.loading = true;
      this.centralRepositoryService.massApprove(this.selectedRowsList.map((record: {id: string, status: string, cfinCode: number}) => record.id), this.approveComment)?.pipe(untilDestroyed(this)).subscribe({
        next: () => { 
          this.loading = false;
          this.approveModalVisible = false;
          this.approveComment = '';
          this.getTableFilters(true);
          this.getTableData();
          this.updateSelectedRecords();
        },
        error: () => {
          this.loading = false;
          this.approveModalVisible = false;
          this.approveComment = '';
          this.errorMessage = 'There was an error while approving the records';
          this.errorModalVisible = true;
        }
      });
    }
  }

  massDelete(): void {
    this.loading = true;
    this.isDeleting = true;
    this.centralRepositoryService.massDelete(this.selectedRowsList.map((record: {id: string, status: string, cfinCode: number}) => record.id))?.pipe(untilDestroyed(this)).subscribe({
      next: () => { 
        this.selectedRowsList = [];
        this.checkSelectedList();
        this.loading = false;
        this.isDeleting = false;
        this.massDeleteModalVisible = false;
        this.isAnyCfinInvalid = false;
        this.getTableFilters(true);
        this.getTableData();
      },
      error: () => {
        this.loading = false;
        this.isDeleting = false;
        this.massDeleteModalVisible = false;
        this.errorMessage = 'There was an error while deleting the records';
        this.errorModalVisible = true;
      }
    });
  }

  updateSelectedRecords(): void {
    this.selectedRowsList = this.selectedRowsList.map(record => {
      return {
        ...record,
        status: vendorCustomerStatus.approved
      };
    });

    this.checkSelectedList();
  }

  openMassApproveModal(): void {
    this.approveModalVisible = true;
  }

  openMassDeleteModal(): void {
    this.massDeleteModalVisible = true;
  }

  closeApproveModal(): void {
    this.approveModalVisible = false;
    this.approveComment = '';
  }
}
