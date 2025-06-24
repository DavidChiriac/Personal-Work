import { TestBed } from '@angular/core/testing';
import { CentralRepositoryService } from './central-repository.service';
import { SessionStorageService } from 'ngx-webstorage';
import { MockService } from 'ng-mocks';
import {
  HttpTestingController,
} from '@angular/common/http/testing';
import { IVendorCustomerRequestParams } from './central-repository-table/models/central-repository-table.interface';
import { environment } from '../../../environments/environment';
import { TestingModule } from '../../shared/testing.module';
import { SortDirectionEnum } from '../../shared/utils/sort-directions';

describe('CentralRepositoryService', () => {
  let centralRepositoryService: CentralRepositoryService;
  let httpMock: HttpTestingController;
  const requestParams: IVendorCustomerRequestParams = {
    pageSize: 0,
    pageNumber: 0,
    fieldToSort: '',
    sortDirection: SortDirectionEnum.None,
    globalSearchInput: '',
  };

  const mockSessionStorageService: SessionStorageService = MockService(
    SessionStorageService,
    {
      retrieve: jest.fn().mockReturnValue([]),
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        CentralRepositoryService,
        {
          provide: SessionStorageService,
          useValue: mockSessionStorageService,
        },
      ],
    }).compileComponents();
    centralRepositoryService = TestBed.inject(CentralRepositoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', (): void => {
    expect(centralRepositoryService).toBeTruthy();
  });

  it('should call getVendorCustomerData successfully', () => {
    // Act
    centralRepositoryService.getVendorCustomerData(requestParams).subscribe();
    const req = httpMock.expectOne(
      environment.apiUrl + '/api/vcm/central-data-api/get-all'
    );

    // Assert
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestParams);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({});
  });

  it('should call getVendorCustomerDataFilters successfully', () => {
    // Act
    centralRepositoryService.getVendorCustomerDataFilters().subscribe();
    const req = httpMock.expectOne(
      environment.apiUrl + '/api/vcm/central-data-api/get-filters'
    );
    // Assert
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({});
  });

  it('should call selectAllVendorsCustomerRows successfully', () => {
    // Act
    centralRepositoryService
      .selectAllVendorsCustomerRows(requestParams)
      .subscribe();
    const req = httpMock.expectOne(
      environment.apiUrl + '/api/vcm/central-data-api/select-all'
    );

    // Assert
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestParams);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush([]);
  });

  it('should call exportVendorsCustomerData successfully', () => {
    // Arrange
    const requestParams = {};
    const mockResponse = new Blob(['mock data'], {
      type: 'application/octet-stream',
    });

    // Act
    centralRepositoryService
      .exportVendorsCustomerData(requestParams)
      .subscribe();
    const req = httpMock.expectOne(
      environment.apiUrl + '/api/vcm/central-data-api/export'
    );

    // Assert
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestParams);
    expect(req.request.responseType).toBe('blob' as 'json');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse, { status: 200, statusText: 'OK' });
  });

  it('should call exportCfinData successfully', () => {
    // Arrange
    const selectedRows = ['1', '2', '3'];
    const mockResponse = new Blob(['mock data'], {
      type: 'application/octet-stream',
    });

    // Act
    centralRepositoryService.exportCfinData(selectedRows).subscribe();
    const req = httpMock.expectOne(
      environment.apiUrl + '/api/vcm/central-data-api/export-cfin'
    );

    // Assert
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(selectedRows);
    expect(req.request.responseType).toBe('blob' as 'json');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse, { status: 200, statusText: 'OK' });
  });

  it('should call deleteRecord successfully', () => {
    // Arrange
    const id = '123';
    const expectedParams = { id: '123' };

    // Act
    centralRepositoryService.deleteRecord(id).subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/vendor-customer/delete?id=${expectedParams.id}`
    );

    // Assert
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call deleteRecord successfully', () => {
    // Arrange
    const id = '123';

    // Act
    centralRepositoryService.getVendor(id).subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/central-data-api/get/${id}`
    );

    // Assert
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should call getDuplicates successfully', () => {
    // Arrange
    const id = '123';

    // Act
    centralRepositoryService.getDuplicates(id).subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/vendor-customer/get-related-records?id=${id}`
    );

    // Assert
    expect(req.request.method).toBe('POST');
    req.flush([]);
  });

  it('should call saveChanges successfully', () => {
    // Arrange
    const editedRecord = { id: '123', name: 'Updated Vendor' };

    // Act
    centralRepositoryService.saveChanges(editedRecord).subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/vendor-customer/edit`
    );

    // Assert
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(editedRecord);
    req.flush({});
  });

  it('should call getCfinCode successfully', () => {
    // Arrange
    const category = 'category';
    const cfinStart = 123;

    // Act
    centralRepositoryService.getCfinCode(category, cfinStart).subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/vendor-customer/generate-cfin?category=${category}&cfinStart=${cfinStart}`
    );

    // Assert
    expect(req.request.method).toBe('GET');
    req.flush(12345);
  });

  it('should call getCfinOptions successfully', () => {
    // Act
    centralRepositoryService.getCfinOptions().subscribe();
    const req = httpMock.expectOne('/assets/cfinOptions.json');

    // Assert
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should call getCategoryGroupMatching successfully', () => {
    // Act
    centralRepositoryService.getCategoryGroupMatching().subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/vendor-customer/get-category-group-mapping`
    );

    // Assert
    expect(req.request.method).toBe('GET');
    req.flush([{}]);
  });

  it('should call massApprove successfully', () => {
    // Act
    centralRepositoryService.massApprove([], '').subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/vendor-customer/approval`
    );

    // Assert
    expect(req.request.method).toBe('PATCH');
    req.flush([{}]);
  });

  it('should call massDelete successfully', () => {
    const selectedRowIds = ['123s', '456s'];
    const expectedBody = [123, 456];

    // Act
    centralRepositoryService.massDelete(selectedRowIds).subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/vendor-customer/mass`
    );

    // Assert
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(expectedBody);
    req.flush([{}]);
  });

  it('should get next record successfully', () => {
    // Act
    centralRepositoryService.getNextRecord('1s', '').subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/vendor-customer/get-next-record?id=1s`
    );

    // Assert
    expect(req.request.method).toBe('POST');
    req.flush([{}]);
  });

  it('should get previous record successfully', () => {
    // Act
    centralRepositoryService.getPreviousRecord('1s', '').subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/vendor-customer/get-previous-record?id=1s`
    );

    // Assert
    expect(req.request.method).toBe('POST');
    req.flush([{}]);
  });

  it('should update tableFilters with the provided filters', () => {
    // Arrange
    const filters = {
      statuses: ['New', 'Mapped'],
      matchings: [],
      origins: ['Sap Corp', 'Sap Gamma'],
      vendorCodes: [true, false],
      customerCodes: [false],
      categories: ['Category 1', 'Category 2'],
      bpGroupings: ['Group 1', 'Group 2'],
      accountGroups: ['Group A', 'Group B'],
    } as any;

    // Act
    const updatedFilters = centralRepositoryService.createFilters(filters);

    // Assert
    expect(updatedFilters.status).toEqual([
      { value: 'New' },
      { value: 'Mapped' },
    ]);

    expect(updatedFilters.origin).toEqual([
      { value: 'Sap Corp' },
      { value: 'Sap Gamma' },
    ]);

    expect(updatedFilters.vendor).toEqual([
      { value: true },
      { value: false },
    ]);
    expect(updatedFilters.customer).toEqual([{ value: false }]);

    expect(updatedFilters.category).toEqual([
      { value: 'Category 1' },
      { value: 'Category 2' },
    ]);

    expect(updatedFilters.bpGrouping).toEqual([
      { value: 'Group 1' },
      { value: 'Group 2' },
    ]);

    expect(updatedFilters.accountGroup).toEqual([
      { value: 'Group A' },
      { value: 'Group B' },
    ]);
  });
});
