import { Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Table } from 'primeng/table';
import { UserGroupManagementColumns } from '../../shared/classes/admin-table.columns';
import { AdministrationService } from '../administration.service';
import {
  IUserGroupDTO,
  IUserGroupFilters,
} from './models/userGroupDTO.interface';
import { IGroupDTO } from '../group-management/models/groupDTO.interface';
import { UserGroupFilters } from './models/userGroup.filters';
import { HttpResponse } from '@angular/common/http';
import { SharedServiceService } from '../../shared/services/shared.service';
import { TableComponent } from '../../shared/classes/table.class';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-user-group',
  templateUrl: './user-group-management.component.html',
  styleUrl: './user-group-management.component.scss',
  standalone: false
})
export class UserGroupManagementComponent
  extends TableComponent
  implements OnInit
{
  @ViewChild('dt') override table!: Table;

  override tableColumns = UserGroupManagementColumns.getColumns();
  override tableFilters = new UserGroupFilters();

  editMode = false;

  editedUserGroupMapping: IUserGroupDTO = {};

  groupNames: { id: number; name: string; adGroupId: string }[] = [];
  groupNamesFilters!: string[];
  statusFilters!: boolean[];

  statusChangeModalVisible = false;

  rowIntendedToChangeStatus: { index: number; status: boolean } = {
    index: 0,
    status: false,
  };

  validEmail = true;

  constructor(
    private readonly administrationService: AdministrationService,
    protected override readonly sharedService: SharedServiceService,
    protected override readonly route: ActivatedRoute
  ) {
    super(route, sharedService);
  }

  override ngOnInit(): void {
    this.getGroups();

    this.filterNames = this.tableColumns.map(
      (col) => col.filterField ?? col.field
    );

    this.getFilters();
  }

  getFilters(): void {
    this.administrationService
      .getUserGroupFilters()
      .pipe(untilDestroyed(this))
      .subscribe(
        (filters: {
          filterValues: { groupNames: string[]; status: boolean[] };
        }) => {
          this.groupNamesFilters = filters.filterValues.groupNames;
          this.statusFilters = filters.filterValues.status;
        }
      );
  }

  fetchTableData(): void {
    this.loading = true;
    this.administrationService
      .getUserGroupMappings({
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

  async getGroups(): Promise<void> {
    this.sharedService
      .getGroups()
      .pipe(untilDestroyed(this))
      .subscribe((groupNames: IGroupDTO[]) => {
        this.groupNames = groupNames
          .map((groupName) => ({
            id: groupName.id ?? -1,
            name: groupName.groupName,
            adGroupId: groupName.adGroupId ?? '',
          }))
          .filter((group) => group.name !== '');
      });
  }

  populateTableData(data: {
    userFilterDTO: IUserGroupFilters;
    users: IUserGroupDTO[];
  }): void {
    this.tableData = data?.users?.map((mapping: IUserGroupDTO) => ({
      ...mapping,
      ...this.formatDateFields(mapping),
      group: this.groupNames.find(
        (groupName) => mapping.groupName === groupName.name
      ),
    }));
    this.totalRecords = data.userFilterDTO?.filterPageDTO.numberOfRecords ?? 0;
    this.loading = false;

    this.persistSelectedRows();
  }

  formatDateFields(mapping: IUserGroupDTO): {createdOn: Date, createdOnTime: string, lastUpdatedOn: Date, lastUpdatedOnTime: string} {
    return {
      createdOn: new Date(mapping.createdOn?.toString()?.split('T')[0] ?? ''),
      createdOnTime:
        mapping.createdOn?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
      lastUpdatedOn: new Date(
        mapping.lastUpdatedOn?.toString()?.split('T')[0] ?? ''
      ),
      lastUpdatedOnTime:
        mapping.lastUpdatedOn?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
    };
  }

  enterEditMode(): void {
    this.editMode = true;
    this.table._first = 0;
    this.editedUserGroupMapping = {};
  }

  createUserGroupMapping(): void {
    this.editMode = false;
    this.loading = true;

    this.administrationService
      .createUserGroupMapping(this.editedUserGroupMapping)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (mapping: IUserGroupDTO) => {
          this.tableData[0] = {
            ...mapping,
            ...this.formatDateFields(mapping),
            group: this.groupNames.find(
              (groupName) => mapping.groupName === groupName.name
            ),
          };
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.status === 400
              ? error?.error?.detail
              : `The user could not be assigned.`;
          this.toggleErrorModal();
          this.tableData.shift();
          this.totalRecords -= 1;
          this.loading = false;
        },
      });
  }

  globalSearch(): void {
    this.table.clearFilterValues();
    this.tableFilters.emptyFilters();
    this.administrationService
      .globalSearch(
        this.globalSearchText,
        this.requestParams.pageSize,
        this.requestParams.pageNumber
      )
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: {
          userAccessAssignmentDTOS: IUserGroupDTO[];
          pagination: { numberOfRecords: number };
        }) => {
          this.tableData = data?.userAccessAssignmentDTOS?.map(
            (mapping: IUserGroupDTO) => ({
              ...mapping,
              ...this.formatDateFields(mapping),
              group: this.groupNames.find(
                (groupName) => mapping.groupName === groupName.name
              ),
            })
          );
          this.totalRecords = data.pagination.numberOfRecords ?? 0;
          this.loading = false;

          this.persistSelectedRows();
        }
      );
  }

  exitEditMode(): void {
    this.editMode = false;
    this.tableData.shift();
    this.totalRecords -= 1;
  }

  assignNew(): void {
    this.editMode = true;
    (this.tableData as IUserGroupDTO[]).unshift({
      isActive: true,
    });
    this.totalRecords += 1;
    this.enterEditMode();
  }

  showStatusChangeModal(event: { index: number; status: boolean }): void {
    this.statusChangeModalVisible = true;
    this.rowIntendedToChangeStatus = {
      index: event.index,
      status: event.status,
    };
  }

  hideStatusChangeConfirmation(): void {
    this.statusChangeModalVisible = false;
  }

  approveStatusChange(): void {
    this.administrationService
      .deleteUserGroupMapping({
        ...this.tableData[this.rowIntendedToChangeStatus.index],
      })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          (
            this.tableData[
              this.rowIntendedToChangeStatus.index
            ] as IUserGroupDTO
          ).isActive = false;
          this.hideStatusChangeConfirmation();
        },
        error: () => {
          this.hideStatusChangeConfirmation();
        },
      });
  }

  validateEmail(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.validEmail = emailPattern.test(
      this.editedUserGroupMapping.email ?? ''
    );
  }

  override selectAll(params: IUserGroupFilters): Observable<number[]> {
    return this.administrationService.selectAll(params);
  }

  override exportTableData(
    params: IUserGroupFilters,
    selectedItems: Partial<IUserGroupDTO>[] | null = null
  ): Observable<HttpResponse<object>> {
    return this.administrationService.exportTableData(params, selectedItems);
  }
}
