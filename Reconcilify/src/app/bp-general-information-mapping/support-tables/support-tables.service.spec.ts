import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SupportTablesService } from './support-tables.service';
import {
  ICategoryDto,
  IFilters,
} from './support-tables/models/cfinByCategoryDto.interface';
import { ICfinCodeColumn } from './support-tables/models/cfinCodesColumn.interface';
import { ISystemDuplicatesRequestParams } from './system-duplicates/models/system-duplicates-interfaces';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TableFiltersUtils } from '../../shared/utils/table-filters-utils';
import { SystemDuplicatesFilters } from './system-duplicates/models/system-duplicates-filters';
import { CentralRepositoryFilters } from '../central-repository/central-repository-table/models/central-repository-table-filters';
import { TestingModule } from '../../shared/testing.module';

jest.mock('../../shared/utils/table-filters-utils', () => ({
  TableFiltersUtils: {
    convertToMultiselectOption: jest.fn(),
  },
}));

describe('SupportTablesService', () => {
  let supportTablesService: SupportTablesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [SupportTablesService],
    });
    supportTablesService = TestBed.inject(SupportTablesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', (): void => {
    expect(supportTablesService).toBeTruthy();
  });

  it('should call getCfinByCategoryTableData successfully', () => {
    // Arrange
    const mockRequestParams = {};
    const mockData = {};

    // Act & Assert
    supportTablesService
      .getCfinByCategoryTableData(
        mockRequestParams as ICategoryDto & Partial<IFilters>
      )
      .subscribe((data) => {
        expect(data).toEqual(mockData);
      });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/api/vcm/support-table/get-cfins')
    );

    expect(req.request.method).toEqual('GET');
    req.flush(mockData);
  });

  it('should call getPosCustomersCodesTableData successfully', () => {
    // Arrange
    const mockRequestParams = {};
    const mockData = {};

    // Act & Assert
    supportTablesService
      .getPosCustomersCodesTableData(
        mockRequestParams as ICfinCodeColumn & Partial<IFilters>
      )
      .subscribe((data) => {
        expect(data).toEqual(mockData);
      });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/api/vcm/support-table/get-pos')
    );

    expect(req.request.method).toEqual('GET');
    req.flush(mockData);
  });

  it('should call get92CfinCodesTableData successfully', () => {
    // Arrange
    const mockRequestParams = {};
    const mockData = {};

    // Act & Assert
    supportTablesService
      .get92CfinCodesTableData(
        mockRequestParams as ICfinCodeColumn & Partial<IFilters>
      )
      .subscribe((data) => {
        expect(data).toEqual(mockData);
      });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/api/vcm/support-table/get-cat-92')
    );

    expect(req.request.method).toEqual('GET');
    req.flush(mockData);
  });

  it('should call get98CfinCodesTableData successfully', () => {
    // Arrange
    const mockRequestParams = {};
    const mockData = {};

    // Act & Assert
    supportTablesService
      .get98CfinCodesTableData(
        mockRequestParams as ICfinCodeColumn & Partial<IFilters>
      )
      .subscribe((data) => {
        expect(data).toEqual(mockData);
      });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/api/vcm/support-table/get-cat-98')
    );

    expect(req.request.method).toEqual('GET');
    req.flush(mockData);
  });

  it('should call getSystemDuplicatesData successfully', () => {
    // Arrange
    const mockRequestParams = {};
    const mockData = {};

    // Act & Assert
    supportTablesService
      .getSystemDuplicatesData(
        mockRequestParams as ISystemDuplicatesRequestParams & Partial<IFilters>
      )
      .subscribe((data) => {
        expect(data).toEqual(mockData);
      });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/api/vcm/support-table/system-duplicate')
    );

    expect(req.request.method).toEqual('POST');
    req.flush(mockData);
  });

  it('should send a POST request and return response as a Blob', () => {
    const requestParams: ISystemDuplicatesRequestParams = {
      globalSearchInput: '',
      pageNumber: 0,
      pageSize: 20,
    };
    const mockResponse = new Blob(); // You can mock Blob or whatever your backend returns

    supportTablesService
      .exportSystemDuplicatesData(requestParams)
      .subscribe((response) => {
        expect(response).toBeInstanceOf(HttpResponse);
        expect(response.body).toBeInstanceOf(Blob);
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/vcm/support-table/export`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestParams); // Adjust as necessary
    req.flush(mockResponse); // Simulate response from the server
  });

  it('should send a DELETE request with the correct id', () => {
    const id = '12345';

    supportTablesService
      .deleteSystemDuplicateRecord(id)
      .subscribe((response) => {
        expect(response).toBeUndefined(); // DELETE response typically does not return a body
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/vcm/support-table/system-duplicate?id=${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Simulate response from the server (no content)
  });
  
  it('should return system duplicates filters', () => {
    supportTablesService
      .getSystemDuplicatesFilters()
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/support-table/filters`
    );
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });

  it('should create SystemDuplicatesFilters with correct values', () => {
    const filters = {
      origins: ['origin1', 'origin2'],
      vendorCodes: ['vendor1', 'vendor2'],
      customerCodes: ['customer1'],
      categories: ['category1'],
      oneTimeAccounts: ['oneTimeAccount1', 'oneTimeAccount2'],
      accountGroups: ['accountGroup1'],
    };

    (
      TableFiltersUtils.convertToMultiselectOption as jest.Mock
    ).mockImplementation((items) =>
      items?.map((item: string) => ({ value: item }))
    );

    // Act
    const result = supportTablesService.createSystemDuplicatesFilters(filters);

    // Assert
    expect(result.accountGroup).toEqual([{ value: 'accountGroup1' }]);
    expect(result.oneTimeAcc).toEqual([
      { value: 'oneTimeAccount1' },
      { value: 'oneTimeAccount2' },
    ]);
    expect(result.origin).toEqual([{ value: 'origin1' }, { value: 'origin2' }]);
    expect(result.category).toEqual([{ value: 'category1' }]);
    expect(result.customer).toEqual([{ value: 'customer1' }]);
    expect(result.vendor).toEqual([{ value: 'vendor1' }, { value: 'vendor2' }]);
  });

  it('should handle empty filter values', () => {
    // Arrange
    const emptyFilters: Partial<CentralRepositoryFilters> = {};

    const expectedEmptyResult = new SystemDuplicatesFilters();
    // Ensure that the convert function returns empty array for undefined inputs
    (
      TableFiltersUtils.convertToMultiselectOption as jest.Mock
    ).mockImplementation(() => []);

    // Act
    const result =
      supportTablesService.createSystemDuplicatesFilters(emptyFilters);

    // Assert
    expect(result).toEqual(expectedEmptyResult);
    expect(TableFiltersUtils.convertToMultiselectOption).toHaveBeenCalledWith(
      emptyFilters['origins']
    );
    expect(TableFiltersUtils.convertToMultiselectOption).toHaveBeenCalledWith(
      emptyFilters['vendorCodes']
    );
    expect(TableFiltersUtils.convertToMultiselectOption).toHaveBeenCalledWith(
      emptyFilters['bpGrouping']
    );
    expect(TableFiltersUtils.convertToMultiselectOption).toHaveBeenCalledWith(
      emptyFilters['customerCodes']
    );
    expect(TableFiltersUtils.convertToMultiselectOption).toHaveBeenCalledWith(
      emptyFilters['categories']
    );
    expect(TableFiltersUtils.convertToMultiselectOption).toHaveBeenCalledWith(
      emptyFilters['oneTimeAccounts']
    );
    expect(TableFiltersUtils.convertToMultiselectOption).toHaveBeenCalledWith(
      emptyFilters['accountGroups']
    );
  });
});
