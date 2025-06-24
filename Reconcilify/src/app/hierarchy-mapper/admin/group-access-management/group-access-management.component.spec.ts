import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GroupAccessManagementComponent } from './group-access-management.component';
import { AdminService } from '../admin.service';
import { SessionStorageService } from 'ngx-webstorage';
import { IGroupDTO } from '../../../administration/group-management/models/groupDTO.interface';
import { IGroupSourceSystemMappingDTO } from '../models/groupSourceSystemMappingDTO.interface';
import { TestingModule } from '../../../shared/testing.module';
import { Table } from 'primeng/table';
import { SharedServiceService } from '../../../shared/services/shared.service';
import { GroupAccessManagementColumns } from '../models/group-access.columns';

class MockTable {
  _first = 0;
  filters = {};

  filterGlobal = jest.fn();
  clear = jest.fn();
}

describe('GroupAccessManagementComponent', () => {
  let component: GroupAccessManagementComponent;
  let adminService: jest.Mocked<AdminService>;
  let sessionStorageService: jest.Mocked<SessionStorageService>;
  let sharedService: jest.Mocked<SharedServiceService>;
  let mockTable: MockTable;

  const mockGroups: IGroupDTO[] = [
    { id: 1, groupName: 'Group 1' },
    { id: 2, groupName: 'Group 2' },
  ];

  const mockSourceSystems = [
    { id: 1, name: 'System 1' },
    { id: 2, name: 'System 2' },
  ];

  const mockMappings: IGroupSourceSystemMappingDTO[] = [
    {
      id: 1,
      groupId: 1,
      sourceSystemId: 1,
      isActive: true,
      createdDate: '2023-01-01T00:00:00Z',
      lastUpdatedDate: '2023-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    adminService = {
      getSourceSystems: jest.fn().mockReturnValue(of(mockSourceSystems)),
      getGroupSourceSystemMappings: jest.fn().mockReturnValue(of(mockMappings)),
      createGroupAccessMapping: jest.fn().mockReturnValue(of({})),
      updateGroupAccessMapping: jest.fn().mockReturnValue(of({})),
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
    } as unknown as jest.Mocked<AdminService>;

    sessionStorageService = {
      retrieve: jest.fn(),
      store: jest.fn(),
    } as unknown as jest.Mocked<SessionStorageService>;

    sharedService = {
      getGroups: jest.fn().mockReturnValue(of(mockGroups)),
    } as unknown as jest.Mocked<SharedServiceService>;

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        { provide: AdminService, useValue: adminService },
        { provide: SessionStorageService, useValue: sessionStorageService },
        { provide: SharedServiceService, useValue: sharedService },
      ],
    });

    const fixture = TestBed.createComponent(GroupAccessManagementComponent);
    component = fixture.componentInstance;

    mockTable = new MockTable();
    component.table = mockTable as unknown as Table;
    component.table._value = mockMappings;
  });

  it('should initialize with default values', () => {
    expect(component.tableColumns).toEqual(GroupAccessManagementColumns.getColumns());
    expect(component.editMode).toBe(false);
    expect(component.pagination).toEqual({
      pageSize: 20,
      pageNumber: 0,
      sortDirection: '',
      fieldToSort: '',
      globalSearchInput: ''
    });
  });

  it('should call getGroupsAndSourceSystems on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getGroupsAndSourceSystems');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should populate group names when getGroups is called', (done) => {
    component.getGroups().subscribe(() => {
      expect(component.groupNames).toEqual([
        { id: 1, name: 'Group 1' },
        { id: 2, name: 'Group 2' },
      ]);
      done();
    });
  });

  it('should fetch source systems from service and store them', (done) => {
    sessionStorageService.retrieve.mockReturnValue(null);
    component.getSourceSystems().subscribe(() => {
      expect(component.sourceSystems).toEqual(mockSourceSystems);
      expect(sessionStorageService.store).toHaveBeenCalledWith('sourceSystems', mockSourceSystems);
      done();
    });
  });

  it('should use session storage if source systems are already stored', () => {
    sessionStorageService.retrieve.mockReturnValue(mockSourceSystems);
    component.getSourceSystems().subscribe(() => {
      expect(component.sourceSystems).toEqual(mockSourceSystems);
      expect(sessionStorageService.store).not.toHaveBeenCalled();
    });
  });

  it('should populate table data when getData is called', () => {
    component.groupNames = [
      { id: 1, name: 'Group 1' },
      { id: 2, name: 'Group 2' },
    ];
    component.sourceSystems = mockSourceSystems;

    component.getData().subscribe(() => {
      expect(component.tableData).toEqual([
        {
          id: 1,
          groupId: 1,
          sourceSystemId: 1,
          isActive: true,
          createdDate: '2023-01-01 00:00:00',
          lastUpdatedDate: '2023-01-02 00:00:00',
          group: { id: 1, name: 'Group 1' },
          sourceSystem: { id: 1, name: 'System 1' },
        },
      ]);
    });
  });

  it('should toggle edit mode when enterEditMode is called', () => {
    component.enterEditMode();
    expect(component.editMode).toBe(true);
    expect(component.editedGroupAccessMapping).toEqual({});
  });

  it('should exit edit mode when exitEditMode is called', () => {
    component.exitEditMode();
    expect(component.editMode).toBe(false);
    expect(component.table._value.length).toBe(0);
  });

  it('should assign a new group and enter edit mode when assignNew is called', () => {
    component.assignNew();
    expect(component.editMode).toBe(true);
    expect(component.table._value[0]).toEqual({ isActive: true });
  });

  it('should display status change modal and confirm change', () => {
    component.tableData = [{isActive: false}];
    component.showStatusChangeModal(0, true);

    expect(component.rowIntendedToChangeStatus).toStrictEqual({index: 0, status: true});
    
    jest.spyOn(adminService, 'updateGroupAccessMapping').mockReturnValue(of({isActive: true}));

    component.toggleSystemStatus();
    expect(component.statusChangeModalVisible).toBe(false);
    expect(component.tableData[0].isActive).toBe(true);
  });

  it('should update tableData on successful creation', () => {
    const mockGroupAccess: IGroupSourceSystemMappingDTO = {
      createdDate: '2023-10-10T10:10:10',
      lastUpdatedDate: '2023-10-11T11:11:11',
      groupId: 1,
      sourceSystemId: 1
    };
    component.groupNames = [
      { id: 1, name: 'Group 1' },
    ];
    component.sourceSystems = [
      { id: 1, name: 'System 1' }
    ];

    adminService.createGroupAccessMapping.mockReturnValue(of(mockGroupAccess));

    component.createGroupAccessMapping(); 

    expect(component.tableData[0]).toEqual({
      ...mockGroupAccess,
      createdDate: '2023-10-10 10:10:10',
      lastUpdatedDate: '2023-10-11 11:11:11',
      group: { id: 1, name: 'Group 1' },
      sourceSystem: { id: 1, name: 'System 1' }
    });
  });

  it('should handle error by shifting tableData', () => {
    component.tableData.push({});

    adminService.createGroupAccessMapping.mockReturnValue(throwError(() => new Error('Error')));

    component.createGroupAccessMapping();

    expect(component.tableData.length).toBe(0);
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
