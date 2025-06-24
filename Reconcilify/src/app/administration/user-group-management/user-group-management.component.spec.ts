import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';
import { Table } from 'primeng/table';
import { UserGroupManagementComponent } from './user-group-management.component';
import { AdministrationService } from '../administration.service';
import { TestingModule } from '../../shared/testing.module';
import { UserGroupManagementColumns } from '../../shared/classes/admin-table.columns';
import { IGroupDTO } from '../group-management/models/groupDTO.interface';
import { IUserGroupDTO } from './models/userGroupDTO.interface';
import { MockService } from 'ng-mocks';
import { UserGroupFilters } from './models/userGroup.filters';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { SharedServiceService } from '../../shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';

class MockTable {
  _first = 0;
  filters = {};

  filterGlobal = jest.fn();
  clearFilterValues = jest.fn();
}

const mockGroups: IGroupDTO[] = [
  { id: 1, groupName: 'Group 1', adGroupId: 'Group 1' },
  { id: 2, groupName: 'Group 2', adGroupId: 'Group 2' },
];

const mockMappings: IUserGroupDTO[] = [
  {
    id: 1,
    groupName: 'Group 1',
    isActive: true,
    email: 'a@a.com',
    firstName: 'a',
    lastName: 'a',
    createdOn: '2023-01-01T00:00:00Z',
    lastUpdatedOn: '2023-01-02T00:00:00Z',
  },
];

const mockSharedService = MockService(SharedServiceService, {
  getGroups: jest.fn().mockReturnValue(of(mockGroups)),
});

const mockAdministrationService = MockService(AdministrationService, {
  getUserGroupFilters: jest.fn().mockReturnValue(of({filterValues: {groupNames: ['group'], status: [true]}})),
  getUserGroupMappings: jest.fn().mockReturnValue(of({ users: mockMappings })),
  createUserGroupMapping: jest.fn(),
  deleteUserGroupMapping: jest.fn().mockReturnValue(of({})),
  checkEmptyFilters: jest.fn((table) => {
    let filtersApplied = 0;
    if (table.filters) {
      Object.keys(table.filters).forEach((key) => {
        if (Array.isArray(table.filters[key])) {
          if (
            table.filters[key][0].value &&
            table.filters[key][0].value.length >= 0
          ) {
            filtersApplied += 1;
          }
        } else {
          if (
            table.filters[key].value &&
            table.filters[key].value.length >= 0
          ) {
            filtersApplied += 1;
          }
        }
      });
    }
    return filtersApplied === 0;
  }),
  adjustDateFilter: jest.fn(),
  globalSearch: jest.fn().mockReturnValue(of())
});

const mockSessionStorageService = MockService(SessionStorageService, {
  retrieve: jest.fn(),
  store: jest.fn(),
});

const route: any = {};

describe('UserGroupManagementComponent', () => {
  let component: UserGroupManagementComponent;
  let fixture: ComponentFixture<UserGroupManagementComponent>;
  let mockTable: MockTable;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        { provide: AdministrationService, useValue: mockAdministrationService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: SharedServiceService, useValue: mockSharedService },
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    fixture = TestBed.createComponent(UserGroupManagementComponent);
    component = fixture.componentInstance;

    mockTable = new MockTable();
    component.table = mockTable as unknown as Table;
    component.requestParams = { pageNumber: 0, pageSize: 20, sortDirection: '', fieldToSort: '', globalSearchInput: '' };
    component.tableFilters = new UserGroupFilters();
  });

  it('should initialize with default values', () => {
    expect(component.tableColumns).toEqual(
      UserGroupManagementColumns.getColumns()
    );
    expect(component.editMode).toBe(false);
    expect(component.requestParams).toEqual({ 
      pageSize: 20, 
      pageNumber: 0,
      fieldToSort: '',
      sortDirection: '',
      globalSearchInput: ''
    });
  });

  it('should call getGroups on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getGroups');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call onLazyLoad', () => {
    const event = {
      rows: 50,
      first: 0,
      sortField: 'abc',
      sortOrder: 1,
      filters: {
        groupName: [
          {
            value: [
              {
                id: 1,
                name: 'Group 1',
              },
            ],
          },
        ],
        email: {
          value: 'a@a.com',
        },
        lastUpdatedOn: { value: '1.1.1' },
        createdOn: { value: '1.1.1' },
      },
    };

    const normalizeTableFiltersSpy = jest.spyOn(
      component,
      'normalizeTableFilters'
    );
    const getDataSpy = jest.spyOn(component, 'fetchTableData');

    component.onLazyLoad(event);

    expect(normalizeTableFiltersSpy).toHaveBeenCalled();
    expect(getDataSpy).toHaveBeenCalled();
    expect(component.tableFilters.groupName).toEqual([{id: 1, name: 'Group 1'}]);
    expect(component.tableFilters.email).toBe('a@a.com');
  });

  it('should populate group names when getGroups is called', () => {
    component.getGroups();

    expect(component.groupNames).toEqual([
      { id: 1, name: 'Group 1', adGroupId: 'Group 1' },
      { id: 2, name: 'Group 2', adGroupId: 'Group 2' },
    ]);
  });

  it('should populate table data when getData is called', () => {
    component.groupNames = [
      { id: 1, name: 'Group 1', adGroupId: 'Group 1' },
      { id: 2, name: 'Group 2', adGroupId: 'Group 2' },
    ];

    component.fetchTableData();
    expect(component.tableData).toEqual([
      {
        id: 1,
        groupName: 'Group 1',
        email: 'a@a.com',
        firstName: 'a',
        lastName: 'a',
        isActive: true,
        createdOn: new Date('2023-01-01'),
        createdOnTime: '00:00:00',
        lastUpdatedOn: new Date('2023-01-02'),
        lastUpdatedOnTime: '00:00:00',
        group: { id: 1, name: 'Group 1', adGroupId: 'Group 1' },
        _selected: false
      },
    ]);
  });

  it('should toggle edit mode when enterEditMode is called', () => {
    component.enterEditMode();
    expect(component.editMode).toBe(true);
    expect(component.editedUserGroupMapping).toEqual({});
  });

  it('should exit edit mode when exitEditMode is called', () => {
    component.exitEditMode();
    expect(component.editMode).toBe(false);
    expect(component.tableData.length).toBe(0);
  });

  it('should assign a new group and enter edit mode when assignNew is called', () => {
    component.assignNew();
    expect(component.editMode).toBe(true);
    expect(component.tableData[0]).toEqual({ isActive: true });
  });

  it('should display status change modal and confirm change', () => {
    component.tableData = [{ isActive: true }];
    component.showStatusChangeModal({ index: 0, status: true });

    expect(component.rowIntendedToChangeStatus).toStrictEqual({
      index: 0,
      status: true,
    });

    jest.spyOn(mockAdministrationService, 'deleteUserGroupMapping');

    component.approveStatusChange();
    expect(component.statusChangeModalVisible).toBe(false);
  });

  it('should update tableData on successful creation', () => {
    const mockUserGroupMapping: IUserGroupDTO = {
      createdOn: '2023-10-10T10:10:10',
      lastUpdatedOn: '2023-10-11T11:11:11',
      adGroupId: 'Group 1',
      groupName: 'Group 1',
      email: 'a@a.com',
      firstName: 'a',
      lastName: 'a',
    };
    component.groupNames = [{ id: 1, name: 'Group 1', adGroupId: 'Group 1' }];

    jest
      .spyOn(mockAdministrationService, 'createUserGroupMapping')
      .mockReturnValue(of(mockUserGroupMapping));

    component.createUserGroupMapping();

    expect(component.tableData[0]).toEqual({
      ...mockUserGroupMapping,
      createdOn: new Date('2023-10-10'),
      createdOnTime: '10:10:10',
      lastUpdatedOn: new Date('2023-10-11'),
      lastUpdatedOnTime: '11:11:11',
      group: { id: 1, name: 'Group 1', adGroupId: 'Group 1' },
    });
  });

  it('should handle error by shifting tableData', () => {
    component.assignNew();
    jest
      .spyOn(mockAdministrationService, 'createUserGroupMapping')
      .mockReturnValue(throwError(() => new Error('Error')));

    component.createUserGroupMapping();
    expect(component.tableData.length).toBe(0);
  });

  it('should clear global search text and call filterGlobal', () => {
    component.globalSearchText = 'some search text';

    component.clearGlobalSearchText();
    expect(component.globalSearchText).toBe('');

    component.globalSearchText = 'abc';

    component.clearFilters();
    expect(component.globalSearchText).toBe('');
    expect(mockTable.clearFilterValues).toHaveBeenCalled();
  });

  it('should check validate email', () => {
    component.editedUserGroupMapping.email = 'a@a.com';
    component.validateEmail();

    expect(component.validEmail).toBeTruthy();

    component.editedUserGroupMapping.email = 'aa.com';
    component.validateEmail();

    expect(component.validEmail).toBeFalsy();
  });

  it('should call selectAll and set selectedEntries when event.checked is true', () => {
    const mockEntries = [1, 2];
    jest
      .spyOn(mockAdministrationService, 'selectAll')
      .mockReturnValue(of(mockEntries));

    component.tableFilters = new UserGroupFilters();
    component.requestParams = { pageSize: 20, pageNumber: 0, sortDirection: '', fieldToSort: '', globalSearchInput: '' };

    component.onSelectAllChange({ checked: true } as any);

    expect(mockAdministrationService.selectAll).toHaveBeenCalledWith({
      ...component.tableFilters,
      filterPageDTO: {
        pageNumber: null, 
        pageSize: null,
        numberOfRecords: null
      }, 
      globalSearchInput: component.globalSearchText, 
      fieldToSort: component.requestParams.fieldToSort ?? '', 
      sortDirection: component.requestParams.sortDirection,
      pageNumber: 0,
      pageSize: 20
    });

    expect(component.selectedEntries).toEqual([{ id: 1 }, { id: 2 }]);
    expect(component.loading).toBe(false);
  });

  it('should clear selectedEntries when event.checked is false', () => {
    component.selectedEntriesList = [{ id: 1 }, { id: 2 }];
    component.totalRecords = 2;
    
    component.onSelectAllChange({ checked: false } as any);
    expect(component.selectedEntriesList).toEqual([]);
    expect(component.allSelected).toBe(false);
  });

  it('should set allSelected to true if all rows are selected and change row color', () => {
    component.totalRecords = 2;
    component.selectedEntriesList = [{ id: 1 }, { id: 2 }];
    component.tableData = [{ id: 1 }, { id: 2 }];

    const changeRowColorSpy = jest.spyOn(component, 'changeRowColor');

    component.onRowSelect({ data: { id: 1 } } as any);

    expect(component.allSelected).toBe(true);
    expect(changeRowColorSpy).toHaveBeenCalledWith(1, true);
  });

  it('should set allSelected to false and change row color', () => {
    const changeRowColorSpy = jest.spyOn(component, 'changeRowColor');
    component.onRowUnselect({ data: { id: 2 } } as any);
    expect(component.allSelected).toBe(false);
    expect(changeRowColorSpy).toHaveBeenCalledWith(2, false);
  });

  it('should update _selected status of the matching row', () => {
    component.tableData = [{ id: 1 }, { id: 2 }, { id: 3 }] as any;

    component.changeRowColor(2, true);
    expect(component.tableData[1]._selected).toBe(true);
  });

  it('should toggle exportDialogVisible', () => {
    component.exportDialogVisible = false;
    component.toggleExportDialog();
    expect(component.exportDialogVisible).toBe(true);

    component.toggleExportDialog();
    expect(component.exportDialogVisible).toBe(false);
  });

  it('should call exportTableData and download file when exportAll is false', () => {
    const blobContent = new Blob(['test']);
    const headers = new HttpHeaders({
      'content-disposition': 'attachment; filename="test.xlsx"',
    });
    const response = new HttpResponse({
      body: blobContent,
      headers,
    });

    jest.spyOn(mockAdministrationService, 'exportTableData').mockReturnValue(of(response));

    component.exportData(false);

    expect(mockAdministrationService.exportTableData).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(component.exportModalVisible).toBe(false);
  });

  it('should show exportModal and start timer when over 1000 records', () => {
    component.totalRecords = 1001;
    const startTimerSpy = jest.spyOn(component, 'startTimer');
    jest.spyOn(mockAdministrationService, 'exportTableData').mockReturnValue(
      of(new HttpResponse<object>({ body: {}, headers: new HttpHeaders() }))
    );

    component.exportData(true);

    expect(startTimerSpy).toHaveBeenCalled();
  });

  it('should show error when selectedEntries exceed 10000', () => {
    component.selectedEntries = Array(10001).fill({ id: 1 });
    const toggleErrorModalSpy = jest.spyOn(component, 'toggleErrorModal');

    component.exportData(false);

    expect(component.errorMessage).toBe(
      '10.000 records or more are selected. The maximum limit is 10.000'
    );
    expect(toggleErrorModalSpy).toHaveBeenCalled();
  });

  it('should increment time and update display', () => {
    component.startTimer();
    jest.advanceTimersByTime(3000); // 3 seconds

    expect(component.time).toBe(3);
    expect(component.display).toBe('00:03');

    component.stopTimer();
    expect(component.time).toBe(0);
    expect(component.display).toBe('00:00');
  });

  it('should return formatted time string', () => {
    expect(component.transform(65)).toBe('01:05');
    expect(component.transform(600)).toBe('10:00');
    expect(component.transform(9)).toBe('00:09');
  });
});
