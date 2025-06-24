import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CfinColumns } from './models/cfin-columns';
import { CategoryFilters } from './models/category-filters';
import { ICfinCodeColumn } from './models/cfinCodesColumn.interface';
import { CategoryColumns } from './models/category.columns';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CfinFilters } from './models/cfin-filters';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { SupportTablesService } from '../support-tables.service';
import { ICategoryDto, IFilters } from './models/cfinByCategoryDto.interface';
import { delay } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { supportTableConsts } from '../support-tables.contant';
import { IColumn } from '../../../shared/interfaces/column.interface';
import { DisplayService } from '../../../shared/services/display.service';
import { TableFiltersUtils } from '../../../shared/utils/table-filters-utils';
import { _isNilOrEmpty } from '../../../shared/utils/lodash-utils';
import { SortDirectionEnum } from '../../../shared/utils/sort-directions';


export enum TableTypesEnum{
  CFIN_BY_CATEGORY = 'cfin-by-category',
  POS_CFIN_CODES = 'pos-customers-codes',
  '92_CFIN_CODES' = '92-cfin-codes',
  '98_CFIN_CODES' = '98-cfin-codes'
}
@UntilDestroy()
@Component({
  selector: 'app-support-tables',
  templateUrl: './support-tables.component.html',
  styleUrl: './support-tables.component.scss',
  standalone: false
})
export class SupportTablesComponent implements OnInit, AfterViewInit {
  @ViewChild(Table) tableRef!: Table;

  tableType!: string;

  tableData: ICategoryDto[] | ICfinCodeColumn[] = [];
  tableColumns: IColumn[] = [];
  tableFilters!: CategoryFilters | CfinFilters;
  cfinByCategoryParams!: (ICategoryDto & Partial<IFilters>);
  posCfinParams!: (ICfinCodeColumn & Partial<IFilters>);
  totalRecords: number = 0;
  tableHeight!: number;

  loading = true;

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly displayService: DisplayService,
    private readonly supportTablesService: SupportTablesService
  ) {
    this.tableType = this.route.snapshot.url[0].path;
    this.tableFilters =
    this.tableType === TableTypesEnum.CFIN_BY_CATEGORY
      ? new CategoryFilters()
      : new CfinFilters();

    this.items = [
      { label: 'Support Tables' },
      { label: supportTableConsts[this.tableType] }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  ngOnInit(): void {
    if (this.tableType === TableTypesEnum.CFIN_BY_CATEGORY) {
      this.tableColumns = CategoryColumns.getColumns();
    } else {
      this.tableColumns = CfinColumns.getColumns();
    }
    this.onLazyLoad(undefined, true);
  }

  ngAfterViewInit(): void {
    this.displayService.contentHeight$
      .pipe(untilDestroyed(this), delay(0))
      .subscribe((height) => {
        this.tableHeight = height;
      });
  }

  onLazyLoad(event?: TableLazyLoadEvent, goToFirstPage: boolean = false): void {
    this.loading = true;
    this.getRequestParams(event, goToFirstPage);
    this.getTableData();
  }

  getTableData(): void {
    switch (this.tableType) {
    case TableTypesEnum.CFIN_BY_CATEGORY:
      this.supportTablesService
        .getCfinByCategoryTableData(this.cfinByCategoryParams)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          const categories: string[]  = [...this.tableFilters.categories];
          data.cfinDTOS.forEach((dto: ICategoryDto) => {
            if(!categories.includes(dto.category)){
              categories.push(dto.category);
            }
          });

          this.tableData = [...data.cfinDTOS.map((item: ICategoryDto) => {return {...item, categories: item.category};})];
          this.createCategoryFilters(categories);
          this.loading = false;
        });
      break;
    case TableTypesEnum.POS_CFIN_CODES:
      this.supportTablesService
        .getPosCustomersCodesTableData(this.posCfinParams)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          this.totalRecords = data.filters.numberOfRecords;
          this.tableData = data.posDTOS.map((value) => {return {cfinCode: value.cfinCode, vendorCustomerName: value.vendorCustomerName};});
          this.loading = false;
        });
      break;
    case TableTypesEnum['92_CFIN_CODES']:
      this.supportTablesService
        .get92CfinCodesTableData(this.posCfinParams)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          this.totalRecords = data.filters.numberOfRecords;
          this.tableData = data.posDTOS.map((value) => {return {cfinCode: value.cfinCode, vendorCustomerName: value.vendorCustomerName};});
          this.loading = false;
        });
      break;
    case TableTypesEnum['98_CFIN_CODES']:
      this.supportTablesService
        .get98CfinCodesTableData(this.posCfinParams)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          this.totalRecords = data.filters.numberOfRecords;
          this.tableData = data.posDTOS.map((value) => {return {cfinCode: value.cfinCode, vendorCustomerName: value.vendorCustomerName};});
          this.loading = false;
        });
      break;
    default:
      break;
    }
  }

  onMultiselectSelectionChange(selectedItems: string[]): void {
    this.tableFilters['selectedCategories'] = selectedItems;
  }

  createCategoryFilters(filters: string[]): void {
    if(this.tableFilters.categories.length === 0){
      this.tableFilters.categories = TableFiltersUtils.convertToMultiselectOption(
        filters
      );
    }
  }

  clearFilters(): void {
    this.tableFilters.reset();
    this.tableRef.reset();
  }

  getRequestParams(
    event?: TableLazyLoadEvent,
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

  setupPagination(event?: TableLazyLoadEvent): void {
    const posCfinParams: ICfinCodeColumn & Partial<IFilters> = {
      ...this.posCfinParams,
      pageSize: event?.rows ?? 20,
      pageNumber: Math.floor(
        (event?.first ?? 0) / (event?.rows ?? 20)
      ),
      fieldToSort: event?.sortField?.toString() ?? '',
      sortDirection: event?.sortOrder === 1 ? SortDirectionEnum.ASC : SortDirectionEnum.DESC,
    };

    this.posCfinParams = posCfinParams;

    let cfinByCategoryParams: ICategoryDto & Partial<IFilters> = {
      ...this.cfinByCategoryParams,
      pageSize: event?.rows ?? 20,
      pageNumber: Math.floor(
        (event?.first ?? 0) / (event?.rows ?? 20)
      ),
      fieldToSort: event?.sortField?.toString() ?? '',
      sortDirection: event?.sortOrder === 1 ? SortDirectionEnum.ASC : SortDirectionEnum.DESC,
    };


    const filters = this.prepareFiltersParams();
    cfinByCategoryParams = { ...cfinByCategoryParams, ...filters };

    this.cfinByCategoryParams = cfinByCategoryParams;
  }

  resetPagination(): void {
    const filters = this.prepareFiltersParams();
    const requestParams = {
      pageSize: 20,
      pageNumber: 0,
      ...filters,
    };

    this.cfinByCategoryParams = requestParams;
    this.posCfinParams = requestParams;
  }

  prepareFiltersParams(): any {
    const selectedCategories = this.tableFilters.selectedCategories?.map(
      (category: any) => category.value.toString()
    );

    const filters =
      this.tableType === TableTypesEnum.CFIN_BY_CATEGORY
        ? {
          ...this.tableFilters,
          categories: selectedCategories,
        }
        : { ...this.tableFilters };

    if(this.tableType === TableTypesEnum.CFIN_BY_CATEGORY) {
      this.tableFilters.deleteUnusedFilters(filters);
    }

    return filters;
  }
}
