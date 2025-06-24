import { Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Table } from 'primeng/table';
import { GroupModuleManagementColumns } from '../../shared/classes/admin-table.columns';
import { AdministrationService } from '../administration.service';
import { SessionStorageService } from 'ngx-webstorage';
import { concatMap, Observable, tap } from 'rxjs';
import { IGroupModuleDTO } from './models/groupModuleDTO.interface';
import { IGroupDTO } from '../group-management/models/groupDTO.interface';
import { SharedServiceService } from '../../shared/services/shared.service';
import { IRequestParams } from '../../shared/interfaces/request-params.interface';
import { IColumn } from '../../shared/interfaces/column.interface';

@UntilDestroy()
@Component({
  selector: 'app-group-management',
  templateUrl: './group-module-management.component.html',
  styleUrl: './group-module-management.component.scss',
  standalone: false
})
export class GroupModuleManagementComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  tableColumns: IColumn[] = GroupModuleManagementColumns.getColumns();
  editMode = false;

  tableData: IGroupModuleDTO[] = [];
  editedGroupModuleMapping: IGroupModuleDTO = {};

  pagination: IRequestParams = {
    pageSize: 20,
    pageNumber: 0,
    sortDirection: '',
    fieldToSort: '',
    globalSearchInput: ''
  };

  moduleNames: {id: number, name: string}[] = [];
  groupNames: {id: number, name: string}[] = [];

  modulesInTableData: {id: number, name: string}[] = [];
  groupNamesInTableData: {id: number, name: string}[] = [];

  statusChangeModalVisible = false;
  rowIntendedToChangeStatus!: IGroupModuleDTO;

  globalSearchText = '';
  emptyFilters = true;

  errorModalVisible = false;
  errorMessage = '';

  constructor(
    private readonly administrationService: AdministrationService, 
    private readonly ssService: SessionStorageService,
    private readonly sharedService: SharedServiceService
  ) {}

  ngOnInit(): void {
    this.getGroupsAndModules();
  }
  
  getGroupsAndModules(): void {
    this.getGroups().pipe(
      concatMap(() => this.getModules()),
      concatMap(() => this.getData())
    ).subscribe();
  }
  
  getGroups(): Observable<IGroupDTO[]> {
    return this.sharedService.getGroups().pipe(
      tap((groupNames: IGroupDTO[]) => {
        this.groupNames = groupNames.map(groupName => ({
          id: groupName.id ?? -1,
          name: groupName.groupName
        })).filter(group => group.name !== '');
      })
    );
  }
  
  getModules(): Observable<{id: number, name: string}[]> {
    return new Observable(observer => {
      const modules = this.ssService.retrieve('modules');
  
      if (modules) {
        this.moduleNames = modules;
        observer.next([]);
        observer.complete();
      } else {
        this.administrationService.getModules().pipe(
          tap((modules: { id: number, name: string }[]) => {
            this.moduleNames = modules.filter(module => module.name !== '');
            this.ssService.store('modules', modules);
          })
        ).subscribe(() => {
          observer.next([]);
          observer.complete();
        });
      }
    });
  }
  
  getData(): Observable<IGroupModuleDTO[]> {
    return this.administrationService.getGroupModuleMappings().pipe(
      tap((mappings: IGroupModuleDTO[]) => {
        this.tableData = mappings.map((mapping: IGroupModuleDTO) => ({
          ...mapping,
          createdOn: mapping.createdOn ? new Date(mapping.createdOn?.toString()?.split('T')[0]) : '',
          createdOnTime: mapping.createdOn?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
          lastUpdatedOn: mapping.lastUpdatedOn ? new Date(mapping.lastUpdatedOn?.toString()?.split('T')[0]) : '',
          lastUpdatedOnTime: mapping.lastUpdatedOn?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
          group: this.groupNames.find(groupName => mapping.groupId === groupName.id),
          module: this.moduleNames.find(moduleName => mapping.moduleId === moduleName.id),
        }));
        this.getModulesInTable();
        this.getGroupInTable();
      })
    );
  }

  enterEditMode(): void {
    this.editMode = true;
    this.table._first = 0;
    this.editedGroupModuleMapping = {};
  }

  createGroupModuleMapping(): void {
    this.editMode = false;

    this.administrationService.createGroupModuleMapping(this.editedGroupModuleMapping)
      .pipe(untilDestroyed(this)).subscribe({
        next: (mapping: IGroupModuleDTO) => {
          this.table._value[0] = {
            ...mapping,
            createdOn: mapping.createdOn ? new Date(mapping.createdOn?.toString()?.split('T')[0]) : '',
            createdOnTime: mapping.createdOn?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
            lastUpdatedOn: mapping.lastUpdatedOn ? new Date(mapping.lastUpdatedOn?.toString()?.split('T')[0]) : '',
            lastUpdatedOnTime: mapping.lastUpdatedOn?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
            group: this.groupNames.find(groupName => mapping.groupId === groupName.id),
            module: this.moduleNames.find(moduleName => mapping.moduleId === moduleName.id),
          };
        },
        complete: () => {
          this.getModulesInTable();
          this.getGroupInTable();
        },
        error: (error) => {
          this.errorMessage = error?.error?.status === 409 ? error?.error?.message : `Mapping could not be created.`;
          this.toggleErrorModal();
          this.table._value.shift();
        }
      });
  }

  getModulesInTable(): void{
    this.modulesInTableData = (this.table._value.length === 0 ? this.tableData : this.table._value)
      .map(row => row.module)
      .filter((module: { id: number; name: string; } | undefined) => module !== undefined);
    this.modulesInTableData = [...new Set(this.modulesInTableData)];
  }

  getGroupInTable(): void{
    this.groupNamesInTableData = (this.table._value.length === 0 ? this.tableData : this.table._value)
      .map(row => row.group)
      .filter((group: { id: number; name: string; } | undefined) => group !== undefined);
    this.groupNamesInTableData = [...new Set(this.groupNamesInTableData)];
  }

  exitEditMode(): void {
    this.table._value.shift();
    this.editMode = false;
  }

  assignNew(): void {
    this.table._value.unshift({
      isActive: true
    });
    this.editMode = true;
    this.enterEditMode();
  }

  showStatusChangeModal(row: IGroupModuleDTO): void {
    this.statusChangeModalVisible = true;
    this.rowIntendedToChangeStatus = row;
  }

  hideStatusChangeConfirmation(): void {
    this.statusChangeModalVisible = false;
  }

  toggleMappingStatus(): void {
    const index = this.table._value.findIndex(row => row.id === this.rowIntendedToChangeStatus.id);
    this.administrationService.updateGroupModuleMapping({...this.table._value[index], isActive: !this.table._value[index].isActive}).pipe(untilDestroyed(this)).subscribe({
      next: (groupModule) => {
        this.table._value[this.pagination.pageNumber * this.pagination.pageSize + index].isActive = groupModule.isActive;
        this.table._value[this.pagination.pageNumber * this.pagination.pageSize + index].lastUpdatedBy = groupModule.lastUpdatedBy;
        this.table._value[this.pagination.pageNumber * this.pagination.pageSize + index].lastUpdatedOn = groupModule.lastUpdatedOn ? new Date(groupModule.lastUpdatedOn?.toString()?.split('T')[0]) : '';
        this.table._value[this.pagination.pageNumber * this.pagination.pageSize + index].lastUpdatedOnTime = groupModule.lastUpdatedOn?.toString()?.split('T')[1]?.slice(0, 8);
        this.hideStatusChangeConfirmation();
      },
      error: () => {
        this.errorMessage = 'There was an error while changing status.';
        this.toggleErrorModal();
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
    this.emptyFilters = this.administrationService.checkEmptyFilters(this.table);
  }

  checkSort(): void{
    this.emptyFilters = false;
  }

  toggleErrorModal(): void {
    this.errorModalVisible = !this.errorModalVisible;
  }
}
