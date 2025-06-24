import { Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Table } from 'primeng/table';
import { GroupManagementColumns } from '../../shared/classes/admin-table.columns';
import { IGroupDTO } from './models/groupDTO.interface';
import { AdministrationService } from '../administration.service';
import { SharedServiceService } from '../../shared/services/shared.service';
import { IColumn } from '../../shared/interfaces/column.interface';

@UntilDestroy()
@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrl: './group-management.component.scss',
  standalone: false
})
export class GroupManagementComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  tableColumns: IColumn[] = GroupManagementColumns.getColumns();
  editMode = false;
  newGroupCreation = false;

  tableData: IGroupDTO[] = [];
  editedGroup!: IGroupDTO;
  oldGroup!: IGroupDTO;

  errorModalVisible = false;
  errorMessage = '';

  invalidGroupName = false;
  invalidAdGroupId = false;
  invalidMessage = '';

  statusChangeModalVisible = false;
  rowIntendedToChangeStatus!: IGroupDTO;

  first = 0;

  globalSearchText = '';
  emptyFilters = true;

  constructor(
    private readonly administrationService: AdministrationService,
    private readonly sharedService: SharedServiceService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void{
    this.sharedService.getGroups().pipe(untilDestroyed(this)).subscribe((groups: IGroupDTO[]) => {
      this.tableData = groups.map((group: IGroupDTO) => {
        return {
          ...group,
          createdDate: group.createdDate ? new Date(group.createdDate?.toString()?.split('T')[0]) : '',
          createdDateTime: group.createdDate?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
          lastUpdatedDate: group.lastUpdatedDate ? new Date(group.lastUpdatedDate?.toString()?.split('T')[0]) : '',
          lastUpdatedDateTime: group.lastUpdatedDate?.toString()?.split('T')[1]?.slice(0, 8) ?? ''
        };
      });
    });
  }

  validateGroupName(): void {
    let matchCount = 0;

    if(this.editedGroup.groupName === ''){
      this.invalidGroupName = true;
      this.invalidMessage = 'Group Name is empty';
      return;
    }
  
    for (const group of this.tableData) {
      if (group.groupName === this.editedGroup.groupName) {
        matchCount+=1;
        if (matchCount > 1) {
          this.invalidGroupName = true;
          this.invalidMessage = 'Group Name already exists';
          return;
        }
      }
    }
  
    this.invalidGroupName = false;
    this.validateAdGroupId();
  }

  validateAdGroupId(): void {
    let matchCount = 0;
  
    if(this.editedGroup.adGroupId === ''){
      this.invalidAdGroupId = true;
      this.invalidMessage = 'AD Group Id is empty';
      return;
    }

    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!regex.test(this.editedGroup.adGroupId ?? '')) {
      this.invalidAdGroupId = true;
      this.invalidMessage = 'AD Group Id does not match the required pattern';
      return;
    }

    for (const group of this.tableData) {
      if (group.adGroupId === this.editedGroup.adGroupId) {
        matchCount+=1;
        if (matchCount > 1) {
          this.invalidAdGroupId = true;
          this.invalidMessage = 'AD Group Id already exists';
          return;
        }
      }
    }
  
    this.invalidAdGroupId = false;
  }

  enterEditMode(row: IGroupDTO, index: number): void {
    this.editMode = true;
    this.editedGroup = {...row, isEditing: true };
    this.oldGroup = row; 
    this.tableData[index] = this.editedGroup;
    this.validateAdGroupId();
    this.validateGroupName();
  }

  saveChanges(index: number): void {
    this.editMode = false;
    delete this.editedGroup.isEditing;

    if(this.newGroupCreation) {
      this.administrationService.createGroup(this.editedGroup)
        .pipe(
          untilDestroyed(this)
        )
        .subscribe({
          next: (group: IGroupDTO) => {
            this.tableData[index] = 
              {
                ...group,
                createdDate: group.createdDate ? new Date(group.createdDate?.toString()?.split('T')[0]) : '',
                createdDateTime: group.createdDate?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
                lastUpdatedDate: group.lastUpdatedDate ? new Date(group.lastUpdatedDate?.toString()?.split('T')[0]) : '',
                lastUpdatedDateTime: group.lastUpdatedDate?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
                isEditing: false
              };
          },
          error: (error) => {
            this.errorMessage = error?.error?.message ?? 'Something went wrong!';
            this.toggleErrorModal();
            this.tableData.shift();
          }
        });
    } else {
      this.administrationService.updateGroup(this.editedGroup)
        .pipe(untilDestroyed(this))
        .subscribe((responseGroup) => {
          this.tableData[index] = {
            ...responseGroup,
            createdDate: responseGroup.createdDate ? new Date(responseGroup.createdDate?.toString()?.split('T')[0]) : '',
            createdDateTime: responseGroup.createdDate?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
            lastUpdatedDate: responseGroup.lastUpdatedDate ? new Date(responseGroup.lastUpdatedDate?.toString()?.split('T')[0]) : '',
            lastUpdatedDateTime: responseGroup.lastUpdatedDate?.toString()?.split('T')[1]?.slice(0, 8) ?? ''
          };
        });
    }

    this.newGroupCreation = false;
  }

  exitEditMode(index: number): void {
    this.editMode = false;
    this.invalidAdGroupId = false;
    this.invalidGroupName = false;

    if(this.newGroupCreation) {
      this.tableData.shift();
      this.newGroupCreation = false;
    } else {
      this.tableData[index] = this.oldGroup;
      this.editedGroup = this.oldGroup;
    }
  }

  createGroup(): void {
    this.tableData.unshift({
      groupName: '',
      adGroupId: '',
      isActive: false,
      isEditing: true
    });
    this.newGroupCreation = true;
    this.table._first = 0;
    this.enterEditMode(this.tableData[0], 0);
  }

  showStatusToggleConfirmation(row: IGroupDTO, status: boolean): void {
    this.statusChangeModalVisible = true;
    this.rowIntendedToChangeStatus = {...row, isActive: status};
  }

  hideStatusChangeConfirmation(): void {
    this.statusChangeModalVisible = false;
  }

  toggleGroupStatus(): void {
    const index = this.tableData.findIndex(row => row.id === this.rowIntendedToChangeStatus.id);

    const payload = this.tableData[index]?.isEditing ? this.oldGroup : this.tableData[index];
    this.administrationService.updateGroup({...payload, isActive: this.rowIntendedToChangeStatus.isActive}).pipe(untilDestroyed(this)).subscribe({
      next: (group: IGroupDTO) => {
        this.hideStatusChangeConfirmation();

        this.tableData[index].isActive = group.isActive;
        this.tableData[index].lastUpdatedBy = group.lastUpdatedBy;
        this.tableData[index].lastUpdatedDate = group.lastUpdatedDate ? new Date(group.lastUpdatedDate?.toString()?.split('T')[0]) : '';
        this.tableData[index].lastUpdatedDateTime = group.lastUpdatedDate?.toString()?.split('T')[1]?.slice(0, 8);
        if(this.oldGroup?.id === group?.id){
          this.oldGroup.isEditing = false;
          this.oldGroup.isActive = group.isActive;
          this.oldGroup.lastUpdatedBy = group.lastUpdatedBy;
          this.oldGroup.lastUpdatedDate = group.lastUpdatedDate ? new Date(group.lastUpdatedDate?.toString()?.split('T')[0]) : '';
          this.oldGroup.lastUpdatedDateTime = group.lastUpdatedDate?.toString()?.split('T')[1]?.slice(0, 8);
        }
      }
    });
  }

  toggleErrorModal(): void {
    this.errorModalVisible = !this.errorModalVisible;
  }

  clearGlobalSearchText(): void{
    this.globalSearchText = '';
    this.table.filterGlobal('', 'contains');
  }

  clearAll(dt: Table): void{
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
}
