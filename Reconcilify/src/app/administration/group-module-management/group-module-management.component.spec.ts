import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';
import { Table } from 'primeng/table';
import { GroupModuleManagementComponent } from './group-module-management.component';
import { AdministrationService } from '../administration.service';
import { IGroupModuleDTO } from './models/groupModuleDTO.interface';
import { TestingModule } from '../../shared/testing.module';
import { GroupModuleManagementColumns } from '../../shared/classes/admin-table.columns';
import { IGroupDTO } from '../group-management/models/groupDTO.interface';
import { AppModulesEnum } from '../../shared/utils/app-modules';
import { SharedServiceService } from '../../shared/services/shared.service';

class MockTable {
  _first = 0;
  filters = {};

  filterGlobal = jest.fn();
  clear = jest.fn();
}


const mockGroups: IGroupDTO[] = [
  { id: 1, groupName: 'Group 1', adGroupId: 'Group 1' },
  { id: 2, groupName: 'Group 2', adGroupId: 'Group 2' },
];

const mockModules = [
  { id: 1, name: AppModulesEnum.FINANCE },
  { id: 2, name: AppModulesEnum.FNB },
];

const mockMappings: IGroupModuleDTO[] = [
  {
    id: 1,
    groupId: 1,
    moduleId: 1,
    isActive: true,
    createdOn: '2023-01-01T00:00:00Z',
    lastUpdatedOn: '2023-01-02T00:00:00Z',
  },
];

const mockAdministrationService = {
  getModules: jest.fn().mockReturnValue(of(mockModules)),
  getGroupModuleMappings: jest.fn().mockReturnValue(of(mockMappings)),
  createGroupModuleMapping: jest.fn().mockReturnValue(of({})),
  updateGroupModuleMapping: jest.fn().mockReturnValue(of({})),
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

const mockSharedService = {
  getGroups: jest.fn().mockReturnValue(of(mockGroups)),
};

const mockSessionStorageService = {
  retrieve: jest.fn(),
  store: jest.fn(),
};

describe('GroupModuleManagementComponent', () => {
  let component: GroupModuleManagementComponent;
  let mockTable: MockTable;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        { provide: AdministrationService, useValue: mockAdministrationService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: SharedServiceService, useValue: mockSharedService },
      ],
    });

    const fixture = TestBed.createComponent(GroupModuleManagementComponent);
    component = fixture.componentInstance;

    mockTable = new MockTable();
    component.table = mockTable as unknown as Table;
    component.table._value = mockMappings;
  });

  it('should initialize with default values', () => {
    expect(component.tableColumns).toEqual(GroupModuleManagementColumns.getColumns());
    expect(component.editMode).toBe(false);
    expect(component.pagination).toEqual({
      pageSize: 20,
      pageNumber: 0,
      fieldToSort: '',
      sortDirection: '',
      globalSearchInput: ''
    });
  });

  it('should call getGroupsAndModules on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getGroupsAndModules');
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

  it('should fetch modules from service and store them', (done) => {
    jest.spyOn(mockSessionStorageService, 'retrieve').mockReturnValue(null);
    component.getModules().subscribe(() => {
      expect(component.moduleNames).toEqual(mockModules);
      expect(mockSessionStorageService.store).toHaveBeenCalledWith('modules', mockModules);
      done();
    });
  });

  it('should use session storage if modules are already stored', () => {
    jest.spyOn(mockSessionStorageService, 'retrieve').mockReturnValue(mockModules);
    component.getModules().subscribe(() => {
      expect(component.moduleNames).toEqual(mockModules);
      expect(mockSessionStorageService.store).not.toHaveBeenCalled();
    });
  });

  it('should populate table data when getData is called', () => {
    component.groupNames = [
      { id: 1, name: 'Group 1' },
      { id: 2, name: 'Group 2' },
    ];
    component.moduleNames = mockModules;

    component.getData().subscribe(() => {
      expect(component.tableData).toEqual([
        {
          id: 1,
          groupId: 1,
          moduleId: 1,
          isActive: true,
          createdDate: '2023-01-01 00:00:00',
          lastUpdatedDate: '2023-01-02 00:00:00',
          group: { id: 1, name: 'Group 1' },
          module: { id: 1, name: AppModulesEnum.FINANCE },
        },
      ]);
    });
  });

  it('should toggle edit mode when enterEditMode is called', () => {
    component.enterEditMode();
    expect(component.editMode).toBe(true);
    expect(component.editedGroupModuleMapping).toEqual({});
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
    component.table._value = component.tableData;
    component.showStatusChangeModal({index: 0, status: true});

    expect(component.rowIntendedToChangeStatus).toStrictEqual({index: 0, status: true});
    
    jest.spyOn(mockAdministrationService, 'updateGroupModuleMapping').mockReturnValue(of({isActive: true}));

    component.toggleMappingStatus();
    expect(component.statusChangeModalVisible).toBe(false);
    expect(component.tableData[0].isActive).toBe(true);
  });

  it('should update tableData on successful creation', () => {
    const mockGroupModuleMapping: IGroupModuleDTO = {
      createdOn: '2023-10-10T10:10:10',
      lastUpdatedOn: '2023-10-11T11:11:11',
      groupId: 1,
      moduleId: 1
    };
    component.groupNames = [
      { id: 1, name: 'Group 1' },
    ];
    component.moduleNames = [
      { id: 1, name: AppModulesEnum.FINANCE }
    ];

    jest.spyOn(mockAdministrationService, 'createGroupModuleMapping').mockReturnValue(of(mockGroupModuleMapping));

    component.createGroupModuleMapping(); 

    expect(component.table._value[0]).toEqual({
      ...mockGroupModuleMapping,
      createdOn: new Date('2023-10-10'),
      createdOnTime: '10:10:10',
      lastUpdatedOn: new Date('2023-10-11'),
      lastUpdatedOnTime: '11:11:11',
      group: { id: 1, name: 'Group 1' },
      module: { id: 1, name: AppModulesEnum.FINANCE }
    });
  });

  it('should handle error by shifting tableData', () => {
    mockAdministrationService.createGroupModuleMapping.mockReturnValue(throwError(() => new Error()));
    component.table._value?.push({});
    component.createGroupModuleMapping();

    expect(component.table._value.length).toBe(mockMappings.length);
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
