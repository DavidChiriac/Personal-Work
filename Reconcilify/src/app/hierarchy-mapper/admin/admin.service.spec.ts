import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin.service';
import { environment } from '../../../environments/environment';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestingModule } from '../../shared/testing.module';
import { IGroupSourceSystemMappingDTO } from './models/groupSourceSystemMappingDTO.interface';
import { Table } from 'primeng/table';

class MockTable {
  filters = {};
}

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  let mockTable: MockTable;

  const mockGroupAccess: IGroupSourceSystemMappingDTO = {
    id: 1,
    groupId: 1,
    sourceSystemId: 1,
    group: { id: 1, name: '' },
    sourceSystem: { id: 1, name: '' },
    createdBy: 'Admin',
    createdDate: '2023-01-01',
    lastUpdatedBy: 'Admin',
    lastUpdatedDate: '2023-01-02',
  };

  const mockSourceSystems = [
    { id: 1, name: 'System A' },
    { id: 2, name: 'System B' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AdminService],
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);

    mockTable = new MockTable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch group source system mappings via GET request', () => {
    service.getGroupSourceSystemMappings().subscribe((mappings) => {
      expect(mappings).toEqual([mockGroupAccess]);
    });

    const req = httpMock.expectOne(
      environment.apiUrl + '/api/group-access/grid'
    );
    expect(req.request.method).toBe('GET');
    req.flush([mockGroupAccess]);
  });

  it('should create a group access mapping via POST request', () => {
    service.createGroupAccessMapping(mockGroupAccess).subscribe();

    const req = httpMock.expectOne(environment.apiUrl + '/api/group-access');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      groupId: mockGroupAccess.group?.id,
      sourceSystemId: mockGroupAccess.sourceSystem?.id,
    });
    req.flush(null);
  });

  it('should update a group access mapping via PUT request', () => {
    service.updateGroupAccessMapping(mockGroupAccess).subscribe();

    const req = httpMock.expectOne(
      environment.apiUrl + `/api/group-access/${mockGroupAccess.id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockGroupAccess);
    req.flush(null);
  });

  it('should fetch source systems via GET request', () => {
    service.getSourceSystems().subscribe((systems) => {
      expect(systems).toEqual(mockSourceSystems);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/api/source-systems');
    expect(req.request.method).toBe('GET');
    req.flush(mockSourceSystems);
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
});
