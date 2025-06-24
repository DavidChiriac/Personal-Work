import { TestBed } from '@angular/core/testing';
import { AdministrationService } from './administration.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { Table } from 'primeng/table';
import { IGroupDTO } from './group-management/models/groupDTO.interface';
import { TestingModule } from '../shared/testing.module';
import { environment } from '../../environments/environment';
import { AppModulesEnum } from '../shared/utils/app-modules';
import { IGroupModuleDTO } from './group-module-management/models/groupModuleDTO.interface';
import {
  IUserGroupDTO,
  IUserGroupFilters,
} from './user-group-management/models/userGroupDTO.interface';
import { SortDirectionEnum } from '../shared/utils/sort-directions';

class MockTable {
  filters = {};
}

const mockGroupModuleMappings: IGroupModuleDTO[] = [
  {
    id: 1,
    groupId: 1,
    group: { id: 1, name: 'a' },
    moduleId: 1,
    module: { id: 1, name: AppModulesEnum.FINANCE },
    isActive: true,
    createdOn: '2023-01-01T00:00:00Z',
    lastUpdatedOn: '2023-01-02T00:00:00Z',
  },
];

const mockGroup: IGroupDTO = {
  id: 1,
  groupName: 'Test Group',
  adGroupId: '123',
  isActive: true,
};

const mockUserGroupMappings: IUserGroupDTO[] = [
  {
    id: 1,
    groupId: '1',
    group: { id: 1, name: 'Group 1' },
    isActive: true,
    email: 'a@a.com',
    firstName: 'a',
    lastName: 'a',
    createdDate: '2023-01-01T00:00:00Z',
    lastUpdatedDate: '2023-01-02T00:00:00Z',
  },
];

describe('AdministrationService', () => {
  let service: AdministrationService;
  let httpMock: HttpTestingController;
  let mockTable: MockTable;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AdministrationService],
    });

    service = TestBed.inject(AdministrationService);
    httpMock = TestBed.inject(HttpTestingController);

    mockTable = new MockTable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch modules via GET request', () => {
    service.getModules().subscribe((modules) => {
      expect(modules).toEqual([AppModulesEnum.FNB]);
    });

    const req = httpMock.expectOne(
      environment.apiUrl + '/api/modules'
    );
    expect(req.request.method).toBe('GET');
    req.flush([AppModulesEnum.FNB]);
  });

  it('should fetch group-module mappings via GET request', () => {
    service.getGroupModuleMappings().subscribe((mappings) => {
      expect(mappings).toEqual(mockGroupModuleMappings);
    });

    const req = httpMock.expectOne(
      environment.apiUrl + '/api/group-module'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockGroupModuleMappings);
  });

  it('should fetch user-group mappings via GET request', () => {
    const mockUserGroupMappingFilters: IUserGroupFilters = {
      groupName: [{ name: 'a', id: 1 }],
      filterPageDTO: {
        pageSize: 50,
        pageNumber: 1,
      },
      email: null,
      firstName: null,
      lastName: null,
      createdOn: null,
      createdBy: null,
      lastUpdatedOn: null,
      lastUpdatedBy: null,
      isActive: true,
      fieldToSort: '',
      sortDirection: SortDirectionEnum.ASC,
      globalSearchInput: '',
      createdOnFrom: null,
      createdOnTo: null,
      lastUpdatedOnFrom: null,
      lastUpdatedOnTo: null
    };
    service
      .getUserGroupMappings({ ...mockUserGroupMappingFilters, pageSize: 50, pageNumber: 0})
      .subscribe((mappings) => {
        expect(mappings).toEqual(mockUserGroupMappings);
      });

    const req = httpMock.expectOne(
      environment.apiUrl + '/api/azure/users'
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockUserGroupMappings);
  });

  it('should create a group via POST request', () => {
    service.createGroup(mockGroup).subscribe();
    delete mockGroup.isActive;
    delete mockGroup.id;

    const req = httpMock.expectOne(
      environment.apiUrl + '/api/group-management'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockGroup);
    req.flush(null);
  });

  it('should create a group-module mapping via POST request', () => {
    service.createGroupModuleMapping(mockGroupModuleMappings[0]).subscribe();

    const req = httpMock.expectOne(environment.apiUrl + '/api/group-module');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      groupId: mockGroupModuleMappings[0].group?.id,
      groupName: mockGroupModuleMappings[0].group?.name,
      moduleId: mockGroupModuleMappings[0].module?.id,
      moduleName: mockGroupModuleMappings[0].module?.name,
    });
    req.flush(null);
  });

  it('should create a user-group mapping via POST request', () => {
    service.createUserGroupMapping(mockUserGroupMappings[0]).subscribe();

    const req = httpMock.expectOne(
      environment.apiUrl +
        `/api/azure/users/${mockUserGroupMappings[0].group?.id}/user?userEmail=${mockUserGroupMappings[0].email}`
    );
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should update a group via PUT request', () => {
    service.updateGroup(mockGroup).subscribe((group) => {
      expect(group).toEqual(mockGroup);
    });

    const req = httpMock.expectOne(
      environment.apiUrl + `/api/group-management/${mockGroup.id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockGroup);
    req.flush(mockGroup);
  });

  it('should update a group-module mapping via PUT request', () => {
    service
      .updateGroupModuleMapping(mockGroupModuleMappings[0])
      .subscribe((mapping) => {
        expect(mapping).toEqual(mockGroupModuleMappings[0]);
      });

    const req = httpMock.expectOne(
      environment.apiUrl + `/api/group-module/${mockGroupModuleMappings[0].id}?active=true`
    );
    expect(req.request.method).toBe('PATCH');
    req.flush(mockGroupModuleMappings[0]);
  });

  it('should update a user-group mapping via PUT request', () => {
    service.deleteUserGroupMapping(mockUserGroupMappings[0]).subscribe();

    const req = httpMock.expectOne(
      environment.apiUrl +
        `/api/azure/users/${mockUserGroupMappings[0].group?.id}/user?userEmail=${mockUserGroupMappings[0].email}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should check if filters are empty', () => {
    mockTable.filters = {
      createdDate: [{ value: ['2025-02-05'] }],
      lastUpdatedAt: { value: ['2025-02-05'] },
    };

    let emptyFilters = service.checkEmptyFilters(mockTable as Table);

    expect(emptyFilters).toBeFalsy();

    mockTable.filters = {};

    emptyFilters = service.checkEmptyFilters(mockTable as Table);

    expect(emptyFilters).toBeTruthy();
  });

  it('should select all user group mappings', () => {
    const mockUserGroupMappingFilters: IUserGroupFilters = {
      groupName: [{ name: 'a', id: 1 }],
      filterPageDTO: {
        pageSize: 50,
        pageNumber: 1,
      },
      email: null,
      firstName: null,
      lastName: null,
      createdOn: null,
      createdBy: null,
      lastUpdatedOn: null,
      lastUpdatedBy: null,
      isActive: true,
      fieldToSort: '',
      sortDirection: SortDirectionEnum.ASC,
      globalSearchInput: '',
      createdOnFrom: null,
      createdOnTo: null,
      lastUpdatedOnFrom: null,
      lastUpdatedOnTo: null
    };
    service.selectAll(mockUserGroupMappingFilters).subscribe((mappings) => {
      expect(mappings).toEqual(mockUserGroupMappings);
    });

    const req = httpMock.expectOne(
      environment.apiUrl + '/api/azure/users/select-all'
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockUserGroupMappings);
  });

  it('should make a POST request and export table data', () => {
    const mockUserGroupMappingFilters: IUserGroupFilters = {
      groupName: [{ name: 'a', id: 1 }],
      filterPageDTO: {
        pageSize: 50,
        pageNumber: 1,
      },
      email: null,
      firstName: null,
      lastName: null,
      createdOn: null,
      createdBy: null,
      lastUpdatedOn: null,
      lastUpdatedBy: null,
      isActive: true,
      fieldToSort: '',
      sortDirection: SortDirectionEnum.ASC,
      globalSearchInput: '',
      createdOnFrom: null,
      createdOnTo: null,
      lastUpdatedOnFrom: null,
      lastUpdatedOnTo: null
    };
    service.exportTableData(mockUserGroupMappingFilters).subscribe();

    const req = httpMock.expectOne(
      (req) =>
        req.method === 'POST' &&
        req.url === environment.apiUrl + '/api/azure/users/export'
    );
    expect(req.request.body).toEqual(
      expect.objectContaining({
        ...mockUserGroupMappingFilters,
      })
    );

    req.flush(new Blob());
  });

  it('should call global search API with correct params', () => {
    const mockResponse = {
      leavers: [],
      pagination: {},
    };

    service.globalSearch('test', 10, 1).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/azure/users/global-search?globalSearchTerm=test&pageSize=10&pageNumber=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call user group API', () => {
    const mockResponse = {groupNames: [], status: []};

    service.getUserGroupFilters().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/azure/users/filters`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
