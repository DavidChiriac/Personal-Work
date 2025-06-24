import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { acknowledgementGlobalFilters } from './models/acknowledgement.global-filters';
import { ILeaverReportAcknowledgement } from './models/leaver-report-acknowledgement.interface';
import { LeaverReportAcknowledgementColumns } from './models/leaver-report-acknowledgement-table.columns';
import { LeaverReportAcknowledgementFilters } from './models/leaver-report-acknowledgement-table.filters';
import { LeaverReportAcknowledgementService } from './leaver-report-acknowledgement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServiceService } from '../../shared/services/shared.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IGlobalFilter, TableComponent } from '../../shared/classes/table.class';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IRequestParams } from '../../shared/interfaces/request-params.interface';
import { AuthService } from '../../shared/services/auth.service';
import { AppRolesEnum } from '../../shared/utils/app-roles';
import { LeaversService } from '../leavers.service';

@UntilDestroy()
@Component({
  selector: 'app-leaver-report-acknowledgement',
  templateUrl: './leaver-report-acknowledgement.component.html',
  styleUrl: './leaver-report-acknowledgement.component.scss',
  standalone: false
})
export class LeaverReportAcknowledgementComponent
  extends TableComponent
  implements OnInit
{
  @ViewChild('dt') override table!: Table;

  override selectedQuickFilter: {
    label: string;
    count?: number;
    status?: number | null;
  } = acknowledgementGlobalFilters.pendingTasks;
  override globalFilters: IGlobalFilter[] = Object.values(acknowledgementGlobalFilters);

  override tableData: ILeaverReportAcknowledgement[] = [];
  override tableColumns = LeaverReportAcknowledgementColumns.getColumns();
  override tableFilters = new LeaverReportAcknowledgementFilters();

  acknowledgeModalVisible = false;
  acknowledgeRow: ILeaverReportAcknowledgement | undefined;

  canAcknowledge = false;
  actionFilters: number[] = [];

  constructor(
    private readonly leaverReportAcknowledgmentService: LeaverReportAcknowledgementService,
    protected override readonly route: ActivatedRoute,
    protected override readonly sharedService: SharedServiceService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly leaversService: LeaversService
  ) {
    super(route, sharedService);

    this.authService.getUserRoles().forEach(role => {
      if(role === AppRolesEnum.LEAVERS_ICFR_CONTROL_OWNER){
        this.canAcknowledge = true;
      }
    });
  }

  getFilters(): void {
    if (this.queryParams.allTasks) {
      this.selectedQuickFilter = acknowledgementGlobalFilters.allTasks;
    }

    this.leaverReportAcknowledgmentService
      .getFilters()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (filters) => {
          const today = new Date();

          const day = today.getDay();
          const diffToMonday = day === 0 ? -6 : 1 - day;

          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() + diffToMonday);
          startOfWeek.setHours(0, 0, 0, 0);

          this.globalFilters = [
            {
              ...acknowledgementGlobalFilters.pendingTasks,
              count: filters['taskCountDTO']?.pendingTasks ?? 0
            },
            {
              ...acknowledgementGlobalFilters.acknowledgedTasks,
              count: filters['taskCountDTO']?.completedTasks ?? 0
            },
            {
              ...acknowledgementGlobalFilters.allTasks,
              count: filters['taskCountDTO']?.allTasks ?? 0
            },
          ];

          this.actionFilters = filters.taskFilterValuesDTO.status;
        }
      });
  }

  globalSearch(event?: string): void {
    if(typeof event === 'string'){
      this.tableFilters.emptyFilters();
      this.table.clearFilterValues();
      this.globalSearchText = event;
    }
    this.loading = true;

    this.leaverReportAcknowledgmentService
      .globalSearch(
        this.globalSearchText,
        this.requestParams.pageSize,
        this.requestParams.pageNumber
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          this.populateTableData({
            userAcknowledgementTaskViewDTO: data.userAcknowledgementTaskViewDTOList,
            taskFilterDTO: {
              filterPageDTO: {
                numberOfRecords: data.extendedFilterPageDTO.numberOfRecords ?? 0,
              },
            },
          });
          this.persistSelectedRows();
          this.table.clearFilterValues();
          this.loading = false;
        },
        complete: () => {
          this.selectedQuickFilter = acknowledgementGlobalFilters.allTasks;
          this.loading = false;

          this.emptyFilters =
            this.tableFilters.filtersAreEmpty() &&
            !this.globalSearchText &&
            !this.requestParams.fieldToSort;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  fetchTableData(): void {
    this.leaverReportAcknowledgmentService
      .getTableData(
        {
          ...this.requestParams,
          ...this.tableFilters,
        },
        this.selectStatus()
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: this.handleDataResponse.bind(this),
        complete: this.handleFetchCompletion.bind(this),
        error: this.handleErrorResponse.bind(this),
      });
  }

  populateTableData(data: {
    userAcknowledgementTaskViewDTO: ILeaverReportAcknowledgement[];
    taskFilterDTO: Partial<LeaverReportAcknowledgementFilters>;
  }): void {
    this.tableData = data.userAcknowledgementTaskViewDTO.map((task) => {
      return {
        ...task,
        week: {
          weekNumber: task.weekNumber,
          retrievedOnFrom: this.sharedService.formatDateFilters(task.periodStart ?? ''),
          retrievedOnTo: this.sharedService.formatDateFilters(task.periodEnd ?? ''),
        },
        acknowledged: task.status ?? null,
        createdOn: this.sharedService.formatDateFilters(task.createdOn),
        acknowledgedOn: this.sharedService.formatDateFilters(
          task.acknowledgedOn
        ),
      };
    });
    this.totalRecords = data.taskFilterDTO.filterPageDTO?.numberOfRecords ?? 0;
  }

  selectAll(
    params: Partial<IRequestParams> &
      Partial<LeaverReportAcknowledgementFilters>
  ): Observable<number[]> {
    return this.leaverReportAcknowledgmentService.selectAll(
      params,
      this.selectStatus()
    );
  }

  exportTableData(
    params: Partial<IRequestParams> &
      Partial<LeaverReportAcknowledgementFilters>,
    selectedItems: Partial<ILeaverReportAcknowledgement>[] | null
  ): Observable<HttpResponse<object>> {
    return this.leaverReportAcknowledgmentService.exportTableData( params, this.selectStatus(), selectedItems );
  }

  selectStatus(): number[] | null {
    let status;
    if(this.tableFilters.selectedAcknowledged && this.tableFilters.selectedAcknowledged.length > 0){
      status = this.tableFilters.selectedAcknowledged;
    } else if(this.selectedQuickFilter.status){
      status = [this.selectedQuickFilter.status];
    } else {
      status = null;
    }
    
    return status;
  }

  viewLeaversList(week: {
    weekNumber: string;
    retrievedOnFrom: string;
    retrievedOnTo: string;
  }): void {
    this.router.navigate(['/leavers/leaver-report'], {
      queryParams: {
        retrievedOnFrom: this.sharedService.formatDateFilters(week.retrievedOnFrom),
        retrievedOnTo: this.sharedService.formatDateFilters(week.retrievedOnTo),
      },
    });
  }

  acknowledgeTask(task?: ILeaverReportAcknowledgement): void {
    this.toggleAcknowledgeModal();
    this.acknowledgeRow = task;
    const index = this.tableData.findIndex((row) => row.id === task?.id);
    if(task){
      this.leaverReportAcknowledgmentService
        .acknowledgeTask(task)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (task) => {
            this.tableData[
              this.requestParams.pageNumber * this.requestParams.pageSize + index
            ] = {
              ...this.tableData[this.requestParams.pageNumber * this.requestParams.pageSize + index],
              ...task,
              acknowledgedOn: this.sharedService.formatDateFilters(task.acknowledgedOn),
              acknowledged: task.status ?? null
            };
          },
          complete: () => {
            this.getFilters();
            this.leaversService.noOfTasks$.next(this.leaversService.noOfTasks$.getValue() - 1);
          }
        });
    }
  }

  toggleAcknowledgeModal(task?: ILeaverReportAcknowledgement): void {
    this.acknowledgeModalVisible = !this.acknowledgeModalVisible;
    this.acknowledgeRow = task;
  }
}
