import { Component, OnInit, ViewChild } from '@angular/core';
import { quickFilters } from './quick-filters.contant';
import { IColumn } from '../../shared/interfaces/column.interface';
import { Table} from 'primeng/table';
import {
  codeNameAttribute,
  IItemDto,
  IItemFilterDTO,
  IProduct,
  IProductFilters,
  IProductRequestParams,
} from './models/products-mapping-table.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SessionStorageService } from 'ngx-webstorage';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { ProductsMappingFilters } from './models/products-mapping-table-filters';
import { ProductsMappingColumns } from './models/products-mapping-table.columns';
import { ProductsMappingStatusEnum } from './models/products-mapping-status.enum';
import { GlobalHierarchiesService } from '../global-hierarchies/global-hierarchies.service';
import { IGlobalHierarchies } from '../global-hierarchies/models/global-hierarchies.interface';
import { TimedSessionStorageService } from '../../shared/services/timed-session-storage.service';
import { MessageService } from 'primeng/api';
import { ProductsMappingService } from './products-mapping.service';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';
import { AppRolesEnum } from '../../shared/utils/app-roles';
import { TableComponent } from '../../shared/classes/table.class';
import { SharedServiceService } from '../../shared/services/shared.service';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-products-mapping',
  templateUrl: './products-mapping.component.html',
  styleUrl: './products-mapping.component.scss',
  standalone: false
})
export class ProductsMappingComponent extends TableComponent implements OnInit {
  @ViewChild('dt') override table!: Table;

  override selectedQuickFilter: {label: string, id?: ProductsMappingStatusEnum} = { label: quickFilters.invalid, id: this.statusEnum.Invalid};
  override tableColumns = ProductsMappingColumns.getColumns();
  override tableFilters = new ProductsMappingFilters();
  override queryParams: {selectedSourceSystems: string | undefined, invalidReason: string | undefined} = {
    selectedSourceSystems: undefined,
    invalidReason: undefined
  };

  noOfFrozenColumns = 0;
  frozenColumns: IColumn[] = [];
  newOrderTableColumns = ProductsMappingColumns.getColumns();

  categoryOptions: codeNameAttribute[] = [];
  groupOptions: codeNameAttribute[] = [];
  subGroupOptions: codeNameAttribute[] = [];

  editMode = false;
  backupEntry!: IProduct;
  editedEntry!: IProduct;

  categoryGroupSubgroupMapping: {
    globalCategoryName: codeNameAttribute;
    globalGroupName: codeNameAttribute;
    globalSubgroupName: codeNameAttribute;
  }[] = [];

  userRoles: AppRolesEnum[] = [];
  userCanEdit = false;

  constructor(
    private readonly productMappingService: ProductsMappingService,
    private readonly ssService: SessionStorageService,
    private readonly timedSSService: TimedSessionStorageService,
    private readonly globalHierarchiesService: GlobalHierarchiesService,
    private readonly messageService: MessageService,
    protected override readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    protected override readonly sharedService: SharedServiceService
  ) {
    super(route, sharedService);
  }

  override ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    this.userCanEdit = this.userRoles.some((role) => [AppRolesEnum.ADMIN, AppRolesEnum.ITEMSHIERARCHYADMIN, AppRolesEnum.ITEMSHIERARCHYEDITOR].includes(role));

    this.getQueryParams();
    const columns = this.ssService.retrieve('columns');

    if (columns) {
      this.newOrderTableColumns = columns.newColumnsOrder;
      this.frozenColumns = columns.frozenColumns;
      this.noOfFrozenColumns = columns.noOfFrozenColumns;
    }

    this.filterNames = this.tableColumns.map((col) => col.filterField ?? col.field);

    const globalHierarchies = this.timedSSService.getItem('global-hierarchies');

    if (globalHierarchies && globalHierarchies.hierarchies?.length > 0 && globalHierarchies.categories?.length > 0) {
      this.categoryGroupSubgroupMapping = globalHierarchies.hierarchies;
      this.categoryOptions = globalHierarchies.categories;
    } else {
      this.getCategoryGroupSubgroupMatching();
    }

    this.getFilters();
  }

  getFilters(): void {
    this.productMappingService
      .getFilters()
      .pipe(untilDestroyed(this))
      .subscribe((filters) => {
        this.tableFilters.validationStatus =
          filters.filterValues.validationStatus.map(
            (statusCode) => ProductsMappingStatusEnum[statusCode]
          );
        this.tableFilters.sourceSystemDesc = filters.filterValues.sourceSystemDesc;

        this.globalFilters = [
          {
            label: quickFilters.invalid,
            count: filters.itemCountDTO.totalInvalidItems,
            id: ProductsMappingStatusEnum.Invalid,
          },
          {
            label: quickFilters.valid,
            count: filters.itemCountDTO.totalValidItems,
            id: ProductsMappingStatusEnum.Valid,
          },
          {
            label: quickFilters.allProducts,
            count: filters.itemCountDTO.totalItems,
            id: -1,
          },
        ];
      });
  }

  globalSearch(): void{
    this.emptyFilters = this.globalSearchText === '';
    this.loading = true;

    this.productMappingService
      .globalSearch(this.globalSearchText, this.requestParams.pageSize, this.requestParams.pageNumber)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          this.populateTableData({items: data.items, filter: {extendedFilterPageDTO: {numberOfRecords: data.pagination.numberOfRecords}}});
          this.persistSelectedRows();
          this.table.clearFilterValues();
          this.loading = false;
        },
        complete: () => {
          this.selectedQuickFilter = {label: quickFilters.allProducts, id: this.statusEnum['All Products']};
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
  
  fetchTableData(): void {
    this.loading = true;
    this.productMappingService
      .getTableData(
        { 
          ...this.requestParams, 
          ...this.tableFilters, 
          selectedStatus: (this.tableFilters.selectedStatus && this.tableFilters.selectedStatus?.length > 0) ? 
            this.tableFilters.selectedStatus : 
            [this.selectedQuickFilter.label] 
        })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: this.handleDataResponse.bind(this),
        complete: this.handleFetchCompletion.bind(this),
        error: this.handleErrorResponse.bind(this)
      });
  }
  
  populateTableData(data: { items: IItemDto[]; filter: Partial<IItemFilterDTO>; }): void {
    this.tableData = data.items.map(this.mapItemDtoToTableData);
    this.totalRecords = data.filter.extendedFilterPageDTO?.numberOfRecords ?? 0;
  }

  getCategoryGroupSubgroupMatching(): void {
    this.globalHierarchiesService
      .getGlobalHierarchies()
      .pipe(untilDestroyed(this))
      .subscribe((hierarchies: IGlobalHierarchies[]) => {
        this.categoryGroupSubgroupMapping = hierarchies.map((combination) => {
          if (
            !this.categoryOptions.some(
              (option) =>
                combination.globalCategoryName === option.name &&
                combination.globalCategoryCode === option.code
            )
          ) {
            this.categoryOptions.push({
              code: combination.globalCategoryCode,
              name: combination.globalCategoryName,
            });
          }
          return {
            id: combination.id,
            globalCategoryName: {
              code: combination.globalCategoryCode,
              name: combination.globalCategoryName,
            },
            globalGroupName: {
              code: combination.globalGroupCode,
              name: combination.globalGroupName,
            },
            globalSubgroupName: {
              code: combination.globalSubgroupCode,
              name: combination.globalSubgroupName,
            },
          };
        });

        this.timedSSService.setItem('global-hierarchies', {
          hierarchies: this.categoryGroupSubgroupMapping,
          categories: this.categoryOptions,
        });
      });
  }

  getGroupOptions(): void {
    this.groupOptions = [];
    this.categoryGroupSubgroupMapping.forEach((item) => {
      if (
        !this.groupOptions.some((group) => item.globalGroupName.name === group.name) &&
        this.editedEntry.proposedCategoryName.code === item.globalCategoryName.code &&
        this.editedEntry.proposedCategoryName.name === item.globalCategoryName.name
      ) {
        this.groupOptions.push(item.globalGroupName);
      }
    });
  }

  getSubgroupOptions(): void {
    this.subGroupOptions = [];
    this.categoryGroupSubgroupMapping.forEach((item) => {
      if (
        !this.subGroupOptions.some(
          (subgroup) =>
            item.globalSubgroupName.name === subgroup.name &&
            item.globalSubgroupName.code === subgroup.code
        ) &&
        this.editedEntry.proposedCategoryName.name === item.globalCategoryName.name &&
        this.editedEntry.proposedCategoryName.code === item.globalCategoryName.code &&
        this.editedEntry.proposedGroupName.code === item.globalGroupName.code &&
        this.editedEntry.proposedGroupName.name === item.globalGroupName.name
      ) {
        this.subGroupOptions.push(item.globalSubgroupName);
      }
    });
  }

  onMultiselectFilter(selectedItem: string[], field: string): void {
    this.tableFilters[field] = selectedItem;
  }

  toggleFrozeOnColumn(event: {col: IColumn, newFrozenStatus: boolean}): void {
    if (this.noOfFrozenColumns === 3 && event.newFrozenStatus) {
      this.showWarning('Only 3 columns can be frozen at a time!');
      return;
    }

    this.newOrderTableColumns = this.newOrderTableColumns.map((column: IColumn) => {
      return column.field === event.col?.field
        ? this.updateColumnFreezeStatus(column, event.col, event.newFrozenStatus)
        : column;
    });
    this.updateNewColumnOrder();
    this.storeColumnState();
  }
  
  showWarning(message: string): void {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: message });
  }
  
  updateColumnFreezeStatus(
    col: IColumn,
    columnToUpdate: IColumn,
    newFrozenStatus: boolean
  ): IColumn {
    col.frozen = newFrozenStatus;
    if (newFrozenStatus && this.noOfFrozenColumns < 3) {
      this.noOfFrozenColumns += 1;
      this.frozenColumns.push(columnToUpdate);
    } else {
      this.noOfFrozenColumns -= 1;
      this.frozenColumns = this.frozenColumns.filter(
        (frozenCol) => frozenCol.field !== columnToUpdate.field
      );
    }
    return col;
  }
  
  updateNewColumnOrder(): void {
    const nonFrozenColumns = this.tableColumns.filter(
      (col, index) =>
        ![0, 1, 2, 3, 4].includes(index) &&
        !this.frozenColumns.some((frozenCol) => frozenCol.field === col.field)
    );
  
    this.newOrderTableColumns = [
      this.tableColumns[0],
      this.tableColumns[1],
      this.tableColumns[2],
      this.tableColumns[3],
      this.tableColumns[4],
      ...this.frozenColumns,
      ...nonFrozenColumns,
    ];
  }
  
  storeColumnState(): void {
    this.ssService.store('columns', {
      newColumnsOrder: this.newOrderTableColumns,
      frozenColumns: this.frozenColumns,
      noOfFrozenColumns: this.noOfFrozenColumns,
    });
  }
  
  enterEditMode(row: IProduct): void {
    this.editMode = true;
    this.backupEntry = { ...row };
    this.editedEntry = { ...row };
    this.getGroupOptions();
    this.getSubgroupOptions();
  }

  mapItemDtoToTableData(item: IItemDto): IProduct {
    return {
      ...item,
      sourceSystemDesc: item?.sourceSystemDesc,
      itemCode: item?.itemCode,
      globalCategoryName: {
        code: item?.globalCategoryCode,
        name: item?.globalCategoryName,
      },
      globalGroupName: {
        code: item?.globalGroupCode,
        name: item?.globalGroupName,
      },
      globalSubgroupName: {
        code: item?.globalSubgroupCode,
        name: item?.globalSubgroupName,
      },
      localCategoryName: {
        code: item?.localCategoryCode,
        name: item?.localCategoryName,
      },
      localGroupName: { code: item?.localGroupCode, name: item?.localGroupName },
      localSubgroupName: {
        code: item?.localSubgroupCode,
        name: item?.localSubgroupName,
      },
      proposedCategoryName: {
        code: item?.proposedCategoryCode,
        name: item?.proposedCategoryName,
      },
      proposedGroupName: {
        code: item?.proposedGroupCode,
        name: item?.proposedGroupName,
      },
      proposedSubgroupName: {
        code: item?.proposedSubgroupCode,
        name: item?.proposedSubgroupName,
      },
      invalidityReasonMessage: item?.invalidityReasonMessage,
      validationStatus: ProductsMappingStatusEnum[item?.validationStatus],
      retrievedOn: item?.retrievedOn ? (item?.retrievedOn?.split('T')?.[0] + ' ' + item?.retrievedOn?.split('T')?.[1]?.slice(0, 8)) : '',
      lastUpdatedBy: item?.lastUpdatedBy,
      lastUpdatedAt: item?.lastUpdatedAt ? (item?.lastUpdatedAt?.split('T')?.[0] + ' ' + item?.lastUpdatedAt?.split('T')?.[1]?.slice(0, 8)): '',
    };
  }

  saveChanges(index: number): void {
    this.loading = true;
    this.productMappingService
      .saveChanges(this.editedEntry)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: IItemDto) => {
          const updateData = this.mapItemDtoToTableData(response);
          this.tableData[index - this.requestParams.pageNumber * this.requestParams.pageSize] =
            updateData;
          this.editMode = false;
          this.loading = false;
        },
        error: () => {
          this.tableData[index] =
            this.backupEntry;
          this.editMode = false;
          this.loading = false;
        },
      });
  }

  exitEditMode(index: number): void {
    this.editMode = false;
    this.tableData[index] = this.backupEntry;
  }

  onProposedCategoryChange(event: DropdownChangeEvent): void {
    this.editedEntry.proposedCategoryName = event.value;
    this.editedEntry.proposedGroupName = { code: '', name: '' };
    this.editedEntry.proposedSubgroupName = { code: '', name: '' };
    this.getGroupOptions();
    this.subGroupOptions = [];
  }

  onProposedGroupChange(event: DropdownChangeEvent): void {
    this.editedEntry.proposedGroupName = event.value;
    this.editedEntry.proposedSubgroupName = { code: '', name: '' };
    this.getSubgroupOptions();
  }

  onProposedSubgroupChange(event: DropdownChangeEvent): void {
    this.editedEntry.proposedSubgroupName = event.value;
  }

  override selectAll(params: Partial<IProductRequestParams> & Partial<IProductFilters>): Observable<number[]> {
    return this.productMappingService.selectAll(params);
  }

  override exportTableData(
    params: Partial<IProductRequestParams> & Partial<IProductFilters>,
    selectedItems: Partial<IProduct>[] | null
  ): Observable<HttpResponse<object>> {
    return this.productMappingService.exportTableData(params, selectedItems);
  }
}
