import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { IGroupDTO } from '../../../administration/group-management/models/groupDTO.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { concatMap, Observable, tap } from 'rxjs';
import { IGroupSourceSystemMappingDTO } from '../models/groupSourceSystemMappingDTO.interface';
import { SessionStorageService } from 'ngx-webstorage';
import { Table } from 'primeng/table';
import { SharedServiceService } from '../../../shared/services/shared.service';
import { AppModulesNamesEnum } from '../../../shared/utils/app-modules.names';
import { GroupAccessManagementColumns } from '../models/group-access.columns';
import { IRequestParams } from '../../../shared/interfaces/request-params.interface';
import { IColumn } from '../../../shared/interfaces/column.interface';

@UntilDestroy()
@Component({
  selector: 'app-group-access-management',
  templateUrl: './group-access-management.component.html',
  styleUrl: './group-access-management.component.scss',
  standalone: false
})
export class GroupAccessManagementComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  tableColumns: IColumn[] = GroupAccessManagementColumns.getColumns();
  editMode = false;

  tableData: IGroupSourceSystemMappingDTO[] = [];
  editedGroupAccessMapping: IGroupSourceSystemMappingDTO = {};

  pagination: IRequestParams = {
    pageSize: 20,
    pageNumber: 0,
    globalSearchInput: '',
    fieldToSort: '',
    sortDirection: ''
  };

  sourceSystems: {id: number, name: string}[] = [];
  groupNames: {id: number, name: string}[] = [];

  sourceSystemsInTableData: {id: number, name: string}[] = [];
  groupNamesInTableData: {id: number, name: string}[] = [];

  statusChangeModalVisible = false;
  rowIntendedToChangeStatus: {index: number, status: boolean} = {
    index: 0,
    status: false
  };

  globalSearchText = '';
  emptyFilters = true;

  constructor(private readonly adminService: AdminService, 
            private readonly sharedService: SharedServiceService,
            private readonly ssService: SessionStorageService) {}

  ngOnInit(): void {
    this.getGroupsAndSourceSystems();
  }
  
  getGroupsAndSourceSystems(): void {
    this.getGroups().pipe(
      concatMap(() => this.getSourceSystems()),
      concatMap(() => this.getData())
    ).subscribe();
  }
  
  getGroups(): Observable<IGroupDTO[]> {
    return this.sharedService.getGroups(AppModulesNamesEnum.FNB).pipe(
      tap((groupNames: IGroupDTO[]) => {
        this.groupNames = groupNames.map(groupName => ({
          id: groupName.id ?? -1,
          name: groupName.groupName
        })).filter(group => group.name !== '');
      })
    );
  }
  
  getSourceSystems(): Observable<{id: number, name: string}[]> {
    return new Observable(observer => {
      const sourceSystems = this.ssService.retrieve('sourceSystems');
  
      if (sourceSystems) {
        this.sourceSystems = sourceSystems;
        observer.next([]);
        observer.complete();
      } else {
        this.adminService.getSourceSystems().pipe(
          tap((sourceSystems: { id: number, name: string }[]) => {
            this.sourceSystems = sourceSystems.filter(sourceSystem => sourceSystem.name !== '');
            this.ssService.store('sourceSystems', sourceSystems);
          })
        ).subscribe(() => {
          observer.next([]);
          observer.complete();
        });
      }
    });
  }
  
  getData(): Observable<IGroupSourceSystemMappingDTO[]> {
    return this.adminService.getGroupSourceSystemMappings().pipe(
      tap((groups: IGroupSourceSystemMappingDTO[]) => {
        this.tableData = groups.map((group: IGroupSourceSystemMappingDTO) => ({
          ...group,
          createdDate: (group.createdDate?.split('T')[0] ?? '') + ' ' + (group.createdDate?.split('T')[1]?.slice(0, 8) ?? ''),
          lastUpdatedDate: (group.lastUpdatedDate?.split('T')[0] ?? '') + ' ' + (group.lastUpdatedDate?.split('T')[1]?.slice(0, 8) ?? ''),
          group: this.groupNames.find(groupName => group.groupId === groupName.id),
          sourceSystem: this.sourceSystems.find(sourceSystem => group.sourceSystemId === sourceSystem.id),
        }));
        this.getSourceSystemsInTable();
        this.getGroupInTable();
      })
    );
  }

  enterEditMode(): void {
    this.editMode = true;
    this.table._first = 0;
    this.editedGroupAccessMapping = {};
  }

  createGroupAccessMapping(): void {
    this.editMode = false;

    this.adminService.createGroupAccessMapping(this.editedGroupAccessMapping)
      .pipe(untilDestroyed(this)).subscribe({
        next: (groupAccess: IGroupSourceSystemMappingDTO) => {
          this.tableData[0] = {
            ...groupAccess,
            createdDate: (groupAccess.createdDate?.split('T')[0] ?? '') + ' ' + (groupAccess.createdDate?.split('T')[1]?.slice(0, 8) ?? ''),
            lastUpdatedDate: (groupAccess.lastUpdatedDate?.split('T')[0] ?? '') + ' ' + (groupAccess.lastUpdatedDate?.split('T')[1]?.slice(0, 8) ?? ''),
            group: this.groupNames.find(groupName => groupAccess.groupId === groupName.id),
            sourceSystem: this.sourceSystems.find(sourceSystem => groupAccess.sourceSystemId === sourceSystem.id),
          };
        },
        complete: () => {
          this.getSourceSystemsInTable();
          this.getGroupInTable();
        },
        error: () => {
          this.tableData.shift();
          this.table._value.shift();
        }
      });
  }

  getSourceSystemsInTable(): void{
    this.sourceSystemsInTableData = this.tableData
      .map(row => row.sourceSystem)
      .filter((sourceSystem): sourceSystem is { id: number; name: string; } => sourceSystem !== undefined);
    this.sourceSystemsInTableData = [...new Set(this.sourceSystemsInTableData)];
  }

  getGroupInTable(): void{
    this.groupNamesInTableData = this.tableData
      .map(row => row.group)
      .filter((group): group is { id: number; name: string; } => group !== undefined);
    this.groupNamesInTableData = [...new Set(this.groupNamesInTableData)];
  }

  exitEditMode(): void {
    this.editMode = false;
    this.tableData.shift();
    this.table._value.shift();
  }

  assignNew(): void {
    this.editMode = true;
    this.tableData.unshift({
      isActive: true
    });
    this.table._value.unshift({
      isActive: true
    });
    this.enterEditMode();
  }

  showStatusChangeModal(index: number, status: boolean): void {
    this.statusChangeModalVisible = true;
    this.rowIntendedToChangeStatus = {
      index: index,
      status: status
    };
  }

  hideStatusChangeConfirmation(): void {
    this.statusChangeModalVisible = false;
  }

  toggleSystemStatus(): void {
    this.adminService.updateGroupAccessMapping({...this.tableData[this.rowIntendedToChangeStatus.index], isActive: this.rowIntendedToChangeStatus.status}).pipe(untilDestroyed(this)).subscribe({
      next: (groupAccess) => {
        this.hideStatusChangeConfirmation();
        this.tableData[this.pagination.pageNumber * this.pagination.pageSize + this.rowIntendedToChangeStatus.index].isActive = groupAccess.isActive;
        this.tableData[this.pagination.pageNumber * this.pagination.pageSize + this.rowIntendedToChangeStatus.index].lastUpdatedBy = groupAccess.lastUpdatedBy;
        this.tableData[this.pagination.pageNumber * this.pagination.pageSize + this.rowIntendedToChangeStatus.index].lastUpdatedDate = (groupAccess.lastUpdatedDate?.split('T')[0] + ' ' + groupAccess.lastUpdatedDate?.split('T')[1]?.slice(0, 8));
      }
    });
  }

  clearGlobalSearchText(): void{
    this.globalSearchText = '';
    this.table.filterGlobal('', 'contains');
  }

  clearAll(dt: Table): void {
    this.globalSearchText = '';
    this.emptyFilters = true;
    dt.clear();
    this.getData();
  }

  checkEmptyFilters(): void {
    this.emptyFilters = this.adminService.checkEmptyFilters(this.table);
  }

  checkSort(): void{
    this.emptyFilters = false;
  }
}
