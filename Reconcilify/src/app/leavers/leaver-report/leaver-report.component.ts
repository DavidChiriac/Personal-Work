import { Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Table } from 'primeng/table';
import { leaverReportGlobalFilters } from './models/leaver-report.global-filters';
import { ILeaverReport } from './models/leaver-report.interface';
import { LeaverReportColumns } from './models/leaver-report-table.columns';
import { LeaverReportFilters } from './models/leaver-report-table.filters';
import { LeaverReportService } from './leaver-report.service';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { SharedServiceService } from '../../shared/services/shared.service';
import { TableComponent } from '../../shared/classes/table.class';
import { Observable } from 'rxjs';
import { IRequestParams } from '../../shared/interfaces/request-params.interface';

@UntilDestroy()
@Component({
  selector: 'app-leaver-report',
  templateUrl: './leaver-report.component.html',
  styleUrl: './leaver-report.component.scss',
  standalone: false
})
export class LeaverReportComponent extends TableComponent implements OnInit {
  @ViewChild('dt') override table!: Table;

  override selectedQuickFilter: { label: string; count?: number; retrievedOnFrom?: string, retrievedOnTo?: string } = { label: leaverReportGlobalFilters.allLeavers};

  override tableColumns = LeaverReportColumns.getColumns();

  override tableFilters = new LeaverReportFilters();

  constructor(
    private readonly leaverReportService: LeaverReportService,
    protected override readonly sharedService: SharedServiceService,
    protected override readonly route: ActivatedRoute
  ) {
    super(route, sharedService);
  }

  getFilters(): void {
    this.leaverReportService
      .getFilters()
      .pipe(untilDestroyed(this))
      .subscribe((filters) => {
        const today = new Date();

        const day = today.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
  
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        this.tableFilters.sourceSystemName = filters.filterValues.systemNames;
        this.tableFilters.isBackdatedLeaver = filters.filterValues.backdatedLeavers;

        this.globalFilters = [
          {
            label: leaverReportGlobalFilters.previousDay,
            count: filters.leaversCountDTO?.previousDayLeavers ?? 0,
            retrievedOnFrom: this.sharedService.formatDateFilters(today.toISOString()),
            retrievedOnTo: this.sharedService.formatDateFilters(today.toISOString())
          },
          {
            label: leaverReportGlobalFilters.currentWeek,
            count: filters.leaversCountDTO?.currentWeekLeavers ?? 0,
            retrievedOnFrom: this.sharedService.formatDateFilters(startOfWeek.toISOString()),
            retrievedOnTo: this.sharedService.formatDateFilters(today.toISOString())
          },
          {
            label: leaverReportGlobalFilters.allLeavers,
            count: filters.leaversCountDTO?.totalLeavers ?? 0,
          },
        ];
      });
  }

  globalSearch(event?: string): void{
    if(typeof event === 'string'){
      this.tableFilters.emptyFilters();
      this.table.clearFilterValues();
      this.globalSearchText = event;
    }

    this.emptyFilters = this.globalSearchText === '';
    this.loading = true;

    this.leaverReportService
      .globalSearch(this.globalSearchText, this.requestParams.pageSize, this.requestParams.pageNumber)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          this.populateTableData({
            leavers: data.leavers,
            leaverFilterCriteria: {
              filterPageDTO: {
                numberOfRecords: data.pagination.numberOfRecords ?? 0,
                pageNumber: this.requestParams.pageNumber,
                pageSize: this.requestParams.pageSize
              },
            },
          });
          this.persistSelectedRows();
          this.table.clearFilterValues();
          this.loading = false;
        },
        complete: () => {
          this.selectedQuickFilter = {label: leaverReportGlobalFilters.allLeavers};
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  fetchTableData(): void {
    this.loading = true;
    this.leaverReportService
      .getTableData({
        ...this.requestParams,
        ...this.tableFilters,
      })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: this.handleDataResponse.bind(this),
        complete: this.handleFetchCompletion.bind(this),
        error: this.handleErrorResponse.bind(this),
      });
  }
  
  populateTableData(data: { leavers: ILeaverReport[]; leaverFilterCriteria: Partial<LeaverReportFilters>; }): void {
    this.tableData = data.leavers.map((leaver) => {
      return {
        ...leaver,
        sourceSystemName: leaver.sourceSystemName,
        retrievedOn: this.sharedService.formatDateFilters(leaver.retrievedOn),
        terminationDate: this.sharedService.formatDateFilters(leaver.terminationDate),
        terminationDateTime: leaver.terminationDate?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
        terminationRecordedOn: this.sharedService.formatDateFilters(leaver.terminationRecordedOn),
        terminationRecordedOnTime: leaver.terminationRecordedOn?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
      };
    });
    this.totalRecords = data.leaverFilterCriteria?.filterPageDTO?.numberOfRecords ?? 0;
    
    if(this.tableFilters.retrievedOn){
      this.selectedQuickFilter = {label: leaverReportGlobalFilters.allLeavers};
    }
  }
  
  override applyQueryParamsFilters(): void {
    if(this.queryParams.retrievedOnFrom){
      this.table.filters['retrievedOn'] = [{
        value: [new Date(this.queryParams.retrievedOnFrom)], 
        matchMode: 'in', 
        operator: 'and'
      }];

      this.queryParams.retrievedOnFrom = undefined;

      if(this.queryParams.retrievedOnTo) {
        this.table.filters['retrievedOn'][0].value.push(new Date(this.queryParams.retrievedOnTo));
      }
    }

    if(this.queryParams.isBackdatedLeaver){
      this.table.filters['selectedBackdatedLeaver'] = [{
        value: [true], 
        matchMode: 'in', 
        operator: 'and'
      }];

      this.queryParams.isBackdatedLeaver = undefined;
    }
  }

  override selectAll(params: Partial<IRequestParams> & Partial<LeaverReportFilters>): Observable<number[]> {
    return this.leaverReportService.selectAll(params);
  }

  override exportTableData(
    params: Partial<IRequestParams> & Partial<LeaverReportFilters>,
    selectedItems: Partial<ILeaverReport>[] | null
  ): Observable<HttpResponse<object>> {
    return this.leaverReportService.exportTableData(params, selectedItems);
  }
}
