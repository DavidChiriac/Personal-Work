import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IGlobalHierarchiesRequestParams,
  IGlobalHierarchiesTableData,
  IGlobalHierarchiesTableFilters,
} from './models/global-hierarchies.interface';
import { GlobalHierarchiesFilters } from './models/global-hierarchies-table-filters';
import { GlobalHierarchiesService } from './global-hierarchies.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GlobalHierarchiesColumns } from './models/global-hierarchies-table.columns';
import { TimedSessionStorageService } from '../../shared/services/timed-session-storage.service';
import { Table } from 'primeng/table';
import { codeNameAttribute } from '../products-mapping/models/products-mapping-table.interface';
import { SortDirectionEnum } from '../../shared/utils/sort-directions';
import { HttpResponse } from '@angular/common/http';
import saveAs from 'file-saver';

@UntilDestroy()
@Component({
  selector: 'app-global-hierarchies',
  templateUrl: './global-hierarchies.component.html',
  styleUrl: './global-hierarchies.component.scss',
  standalone: false
})
export class GlobalHierarchiesComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  tableColumns = GlobalHierarchiesColumns.getColumns();

  tableData: IGlobalHierarchiesTableData[] = [];

  tableFilters = new GlobalHierarchiesFilters();

  requestParams: IGlobalHierarchiesRequestParams = {
    pageSize: 20,
    pageNumber: 0,
    fieldToSort: '',
    sortDirection: SortDirectionEnum.ASC,
  };

  SortDirectionEnum = SortDirectionEnum;

  globalSearchText = '';
  errorMessage = '';
  errorModalVisible = false;

  emptyFilters = true;
  loading = false;

  constructor(
    private readonly globalHierarchiesService: GlobalHierarchiesService,
    private readonly timedSSService: TimedSessionStorageService
  ) {}

  ngOnInit(): void {
    this.getHierarchies();
  }

  getHierarchies(): void {
    const globalHierarchiesTable =
      this.timedSSService.getItem('global-hierarchies');
    if (globalHierarchiesTable) {
      this.loading = true;
      this.tableData = globalHierarchiesTable?.hierarchies?.map(
        (level: {
          id: number;
          globalCategoryName: codeNameAttribute;
          globalGroupName: codeNameAttribute;
          globalSubgroupName: codeNameAttribute;
        }) => {
          return {
            id: level.id,
            globalCategoryName: level.globalCategoryName,
            globalGroupName: level.globalGroupName,
            globalSubgroupName: level.globalSubgroupName,
          };
        }
      );

      this.getFilters();
      this.loading = false;
    } else {
      this.loading = true;
      this.globalHierarchiesService
        .getGlobalHierarchies()
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (hierarchies) => {
            this.tableData = hierarchies.map((level) => {
              return {
                id: level.id,
                globalCategoryName: {
                  name: level.globalCategoryName,
                  code: level.globalCategoryCode,
                },
                globalGroupName: {
                  name: level.globalGroupName,
                  code: level.globalGroupCode,
                },
                globalSubgroupName: {
                  name: level.globalSubgroupName,
                  code: level.globalSubgroupCode,
                },
              };
            });
            this.getFilters();
            this.loading = false;

            this.timedSSService.setItem('global-hierarchies', {
              hierarchies: this.tableData,
            });
          },
          error: () => {
            this.loading = false;
          },
        });
    }
  }

  getFilters(): void {
    this.tableFilters.reset();
    this.tableData?.forEach((tableRow) => {
      if (
        !this.tableFilters.globalCategoryName.some(
          (category) =>
            category.name === tableRow.globalCategoryName.name &&
            category.code === tableRow.globalCategoryName.code
        )
      ) {
        this.tableFilters.globalCategoryName.push(tableRow.globalCategoryName);
      }
      if (
        !this.tableFilters.globalGroupName.some(
          (group) =>
            group.name === tableRow.globalGroupName.name &&
            group.code === tableRow.globalGroupName.code
        )
      ) {
        this.tableFilters.globalGroupName.push(tableRow.globalGroupName);
      }
      if (
        !this.tableFilters.globalSubgroupName.some(
          (subgroup) =>
            subgroup.name === tableRow.globalSubgroupName.name &&
            subgroup.code === tableRow.globalSubgroupName.code
        )
      ) {
        this.tableFilters.globalSubgroupName.push(tableRow.globalSubgroupName);
      }
    });

    this.tableFilters.globalCategoryName = this.tableFilters.globalCategoryName.slice().sort((a, b) => a.code.localeCompare(b.code));
    this.tableFilters.globalGroupName = this.tableFilters.globalGroupName.slice().sort((a, b) => a.code.localeCompare(b.code));
    this.tableFilters.globalSubgroupName = this.tableFilters.globalSubgroupName.slice().sort((a, b) => a.code.localeCompare(b.code));
  }

  checkEmptyFilters(): void {
    this.emptyFilters =
      !this.table.filteredValue && !this.requestParams.fieldToSort;
  }

  onSort(field: string, event: Event): void {
    event.stopPropagation();
    if (this.requestParams.fieldToSort === field) {
      if (this.requestParams.sortDirection === SortDirectionEnum.ASC) {
        this.requestParams.sortDirection = SortDirectionEnum.DESC;
      } else {
        this.requestParams.fieldToSort = '';
      }
    } else {
      this.requestParams.fieldToSort = field;
      this.requestParams.sortDirection = SortDirectionEnum.ASC;
    }

    if (this.requestParams.fieldToSort) {
      this.tableData = [...this.tableData].sort((row1, row2) => {
        if (row1[field].code < row2[field].code) {
          if (this.requestParams.sortDirection === SortDirectionEnum.ASC) {
            return -1;
          }
          return 1;
        } else {
          if (this.requestParams.sortDirection === SortDirectionEnum.ASC) {
            return 1;
          }
          return -1;
        }
      });
    } else {
      this.getHierarchies();
    }
    this.checkEmptyFilters();
  }

  clearGlobalSearchText(): void {
    this.globalSearchText = '';
    this.globalSearch();
  }

  clearAll(dt: Table): void {
    this.emptyFilters = true;
    this.requestParams.fieldToSort = '';
    this.globalSearchText = '';
    dt.clear();
    this.getHierarchies();
  }

  globalSearch(): void {
    this.table.clearFilterValues();
    this.table.filterGlobal(this.globalSearchText, 'contains');
  }

  exportTableData(): void {
    const reqParams: IGlobalHierarchiesTableFilters = {
      selectedCategory: [],
      selectedGroup: [],
      selectedSubgroup: [],
    };
    const assignFilterValue = (
      filterName: string,
      targetProperty: keyof typeof reqParams
    ): void => {
      const filter = this.table?.filters?.[filterName];
      if (Array.isArray(filter)) {
        reqParams[targetProperty] =
          filter[0]?.value || reqParams[targetProperty];
      } else if (filter?.value) {
        reqParams[targetProperty] = filter.value;
      }
    };

    if (this.table?.filters) {
      assignFilterValue('globalCategoryName', 'selectedCategory');
      assignFilterValue('globalGroupName', 'selectedGroup');
      assignFilterValue('globalSubgroupName', 'selectedSubgroup');
    }

    this.loading = true;
    this.globalHierarchiesService
      .exportTableData(reqParams)
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
        },
        error: () => {
          this.errorMessage = 'There was an error while downloading the file';
          this.errorModalVisible = true;
          this.loading = false;
        },
      });
  }

  toggleErrorModal(): void {
    this.errorModalVisible = !this.errorModalVisible;
  }
}
