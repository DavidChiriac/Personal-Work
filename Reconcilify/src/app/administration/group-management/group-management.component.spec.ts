import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GroupManagementComponent } from './group-management.component';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { IGroupDTO } from './models/groupDTO.interface';
import { TestingModule } from '../../shared/testing.module';
import { AdministrationService } from '../administration.service';
import { SharedServiceService } from '../../shared/services/shared.service';

class MockTable {
  _first = 0;
  filters = {};

  filterGlobal = jest.fn();
  clear = jest.fn();
}

const mockGroups: IGroupDTO[] = [
  {
    groupName: 'Group1',
    adGroupId: '123',
    isActive: true,
    createdDate: '2023-01-01T00:10:10',
    lastUpdatedDate: '2023-01-02T00:10:10',
    lastUpdatedBy: 'me',
    isEditing: false,
  },
  {
    groupName: 'Group2',
    adGroupId: '456',
    isActive: false,
    createdDate: '2023-01-03T00:10:10',
    lastUpdatedDate: '2023-01-04T00:10:10',
    lastUpdatedBy: 'me',
    isEditing: false,
  },
];

const mockSharedService = {
  getGroups: jest.fn(() => of(mockGroups)),
};

const mockAdministrationService = {
  createGroup: jest.fn(),
  updateGroup: jest.fn(() => of(mockGroups[0])),
  checkEmptyFilters: jest.fn((table) => {
    let filtersApplied = 0;
    if(table.filters){
      Object.keys(table.filters).forEach((key) => {
        if(Array.isArray(table.filters[key])){
          if(table.filters[key][0].value && table.filters[key][0].value.length >= 0){
            filtersApplied += 1;
          }
        } else {
          if(table.filters[key].value && table.filters[key].value.length >= 0){
            filtersApplied += 1;
          }
        }
      });
    }
    return filtersApplied === 0;
  })
};

describe('GroupManagementComponent', () => {
  let component: GroupManagementComponent;
  let mockTable: MockTable;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        GroupManagementComponent,
        { provide: AdministrationService, useValue: mockAdministrationService },
        { provide: SharedServiceService, useValue: mockSharedService },
        DatePipe
      ],
    });

    component = TestBed.inject(GroupManagementComponent);
    
    mockTable = new MockTable();
    component.table = mockTable as unknown as Table;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tableColumns and call getData on ngOnInit', () => {
    jest.spyOn(component, 'getData');
    component.ngOnInit();
    expect(component.getData).toHaveBeenCalled();
    expect(component.tableColumns.length).toBeGreaterThan(0);
  });

  it('should fetch data and populate tableData in getData', () => {
    component.getData();
    expect(component.tableData).toEqual(
      mockGroups.map((group) => ({
        ...group,
        createdDate: new Date(group.createdDate?.toString()?.split('T')[0] ?? ''),
        createdDateTime: group.createdDate?.toString()?.split('T')[1]?.slice(0, 8) ?? '',
        lastUpdatedDate: new Date(group.lastUpdatedDate?.toString()?.split('T')[0] ?? ''),
        lastUpdatedDateTime: group.lastUpdatedDate?.toString()?.split('T')[1]?.slice(0, 8) ?? ''
      }))
    );

    const mockData = mockGroups.map(data => {
      return {
        ...data,
        lastUpdatedDate: undefined,
        createdDate: undefined
      };
    });
    mockSharedService.getGroups.mockReturnValueOnce(of(mockData));
    component.getData();

    expect(component.tableData).toStrictEqual(
      mockData.map((group) => ({
        ...group,
        createdDate: '',
        createdDateTime: '',
        lastUpdatedDate: '',
        lastUpdatedDateTime: '',
      }))
    );
  });

  it('should enter edit mode for a row in enterEditMode', () => {
    const row = mockGroups[0];
    const index = 0;
    component.enterEditMode(row, index);
    expect(component.editMode).toBeTruthy();
    expect(component.editedGroup).toEqual({ ...row, isEditing: true });
    expect(component.oldGroup).toEqual(row);
    expect(component.tableData[index].isEditing).toBeTruthy();
  });

  it('should update table data on successful group creation', () => {
    component.createGroup();
    mockAdministrationService.createGroup.mockReturnValue(of(mockGroups[0]));
    component.saveChanges(0);

    expect(component.tableData[0]).toEqual({
      createdDate: new Date('2023-01-01'),
      createdDateTime: '00:10:10',
      lastUpdatedDate: new Date('2023-01-02'),
      lastUpdatedDateTime: '00:10:10',
      lastUpdatedBy: 'me',
      isActive: true,
      isEditing: false,
      adGroupId: '123',
      groupName: 'Group1'
    });

    const mockGroup = {
      ...mockGroups[0],
      lastUpdatedDate: undefined,
      createdDate: undefined
    };

    component.createGroup();

    mockAdministrationService.createGroup.mockReturnValue(of(mockGroup));
    component.saveChanges(0);

    expect(component.tableData[0]).toEqual({
      createdDate: '',
      createdDateTime: '',
      lastUpdatedDate: '',
      lastUpdatedDateTime: '',
      lastUpdatedBy: 'me',
      isActive: true,
      isEditing: false,
      adGroupId: '123',
      groupName: 'Group1'
    });
  });

  it('should handle error on group creation and shift tableData', () => {
    component.errorMessage = '';
    component.newGroupCreation = true;
    mockAdministrationService.createGroup.mockReturnValue(throwError(() => new Error()));

    component.editedGroup = {...component.tableData[0], isEditing: false};
    component.saveChanges(0);

    expect(component.errorMessage).toBe('Something went wrong!');
    expect(component.tableData.length).toBe(0);
  });

  it('should update table data on successful group update', () => {
    let mockResponseGroup = {
      createdDate: '2023-10-10T10:10:10',
      lastUpdatedDate: '2023-10-11T11:11:11',
      groupName: '',
      adGroupId: ''
    };

    component.newGroupCreation = false;
    mockAdministrationService.updateGroup.mockReturnValue(of(mockResponseGroup));

    component.editedGroup = {...component.tableData[0], isEditing: false};
    component.saveChanges(0);

    expect(component.tableData[0]).toEqual({
      ...mockResponseGroup,
      createdDate:  new Date('2023-10-10'),
      createdDateTime:  '10:10:10',
      lastUpdatedDate: new Date('2023-10-11'),
      lastUpdatedDateTime: '11:11:11'
    });

    mockResponseGroup = {
      createdDate: '',
      lastUpdatedDate: '',
      groupName: '123',
      adGroupId: '123'
    };

    component.newGroupCreation = false;
    mockAdministrationService.updateGroup.mockReturnValue(of(mockResponseGroup));

    component.editedGroup = {...component.tableData[0], isEditing: false};
    component.saveChanges(0);

    expect(component.tableData[0]).toStrictEqual({
      ...mockResponseGroup,
      createdDate: '',
      createdDateTime: '',
      lastUpdatedDate: '',
      lastUpdatedDateTime: ''
    });
  });

  it('should not modify tableData or state if update fails', () => {
    const initialTableData = [...component.tableData];
    mockAdministrationService.updateGroup.mockReturnValue(throwError(() => new Error('Error')));
    component.editedGroup = {...component.tableData[0], isEditing: false};
    component.saveChanges(0);

    expect(component.tableData).toEqual(initialTableData);
  });

  it('should exit edit mode and reset flags in exitEditMode', () => {
    component.newGroupCreation = true;
    component.tableData = [...mockGroups];
    const index = 0;

    component.exitEditMode(index);
    expect(component.editMode).toBeFalsy();
    expect(component.newGroupCreation).toBeFalsy();
    expect(component.tableData[index].isEditing).toBeFalsy();
  });

  it('should create a new group and enter edit mode in createGroup', () => {
    jest.spyOn(component, 'enterEditMode');
    component.createGroup();
    expect(component.tableData[0].isEditing).toBeTruthy();
    expect(component.newGroupCreation).toBeTruthy();
    expect(component.enterEditMode).toHaveBeenCalledWith(component.tableData[0], 0);
  });

  it('should toggle group status and update the row in toggleGroupStatus', () => {
    const index = 0;
    const status = false;

    jest.spyOn(mockAdministrationService, 'updateGroup').mockReturnValueOnce(of({...mockGroups[index], isActive: status}));

    component.getData();
    component.enterEditMode(component.tableData[index], index);

    component.showStatusToggleConfirmation(component.tableData[index], status);
    component.toggleGroupStatus();


    expect(mockAdministrationService.updateGroup).toHaveBeenCalledWith({
      ...mockGroups[index],
      isActive: status,
      createdDate:  new Date('2023-01-01'),
      createdDateTime:  '00:10:10',
      lastUpdatedDate: new Date('2023-01-02'),
      lastUpdatedDateTime: '00:10:10'
    });
    expect(component.oldGroup).toStrictEqual({
      ...mockGroups[index],
      isActive: status,
      createdDate:  new Date('2023-01-01'),
      createdDateTime:  '00:10:10',
      lastUpdatedDate: new Date('2023-01-02'),
      lastUpdatedDateTime: '00:10:10'
    });
  });

  it('should validate group name and ad group name', () => {
    component.tableData = [...mockGroups];
    component.enterEditMode(component.tableData[0], 0);
    component.validateGroupName();
    component.validateAdGroupId();

    expect(component.invalidGroupName).toBeFalsy();
    expect(component.invalidAdGroupId).toBeTruthy();

    component.enterEditMode({...component.tableData[0], adGroupId: '00000000-9999-4444-9999-bbbbbbbbbbbb'}, 0);
    component.validateAdGroupId();

    expect(component.invalidAdGroupId).toBeFalsy();
  });

  it('should clear global search text and call filterGlobal', () => {
    component.globalSearchText = 'some search text';
    component.clearGlobalSearchText();

    expect(component.globalSearchText).toBe('');
    expect(mockTable.filterGlobal).toHaveBeenCalledWith('', 'contains');

    component.globalSearchText = 'abc';

    component.clearAll(mockTable as unknown as Table);
    expect(component.globalSearchText).toBe('');
    expect(mockTable.clear).toHaveBeenCalled();
  });

  it('should check if filters are empty', () => {
    mockTable.filters = {
      createdDate: [{value:['2025-02-05']}],
      lastUpdatedAt: [{value:['2025-02-05']}],
    };

    component.checkEmptyFilters();

    expect(component.emptyFilters).toBeFalsy();

    component.clearAll(mockTable as unknown as Table);

    expect(component.emptyFilters).toBeTruthy();

    component.checkSort();

    expect(component.emptyFilters).toBeFalsy();
  });
});
