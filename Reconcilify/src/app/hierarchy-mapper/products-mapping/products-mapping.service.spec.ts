import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ProductsMappingService } from './products-mapping.service';
import { environment } from '../../../environments/environment';
import { ProductsMappingStatusEnum } from './models/products-mapping-status.enum';
import { TestingModule } from '../../shared/testing.module';
import { IProduct } from './models/products-mapping-table.interface';

describe('ProductsMappingService', () => {
  let service: ProductsMappingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ProductsMappingService],
    });

    service = TestBed.inject(ProductsMappingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should make a POST request and return table data', () => {
    const mockParams = {
      itemCode: '123',
      itemName: 'Test Item',
      globalCategoryName: 'Category A',
      selectedSourceSystems: ['System A'],
      selectedStatus: ['Valid'],
      pageSize: 10,
      pageNumber: 1,
    };

    const mockResponse = {
      items: [{ id: 1, itemCode: '123', itemName: 'Test Item' }],
      filter: {},
    };

    service.getTableData(mockParams).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (req) =>
        req.method === 'POST' && req.url === environment.apiUrl + '/api/ghm/items'
    );
    expect(req.request.body).toEqual(expect.objectContaining({
      id: '',
      sourceSystemDesc: ['System A'],
      itemCode: '123',
      itemName: 'Test Item',
      globalCategoryName: 'Category A',
      validationStatus: [ProductsMappingStatusEnum['Valid']],
      extendedFilterPageDTO: {
        pageSize: 10,
        pageNumber: 1,
      },
    }));

    req.flush(mockResponse);
  });

  it('should make a POST request and export table data', () => {
    const mockParams = {
      itemCode: '123',
      itemName: 'Test Item',
      globalCategoryName: 'Category A',
      selectedSourceSystems: ['System A'],
      selectedStatus: ['Valid'],
      pageSize: 10,
      pageNumber: 1,
    };

    service.exportTableData(mockParams).subscribe();

    const req = httpMock.expectOne(
      (req) =>
        req.method === 'POST' && req.url === environment.apiUrl + '/api/ghm/items/export'
    );
    expect(req.request.body.filters).toEqual(expect.objectContaining({
      sourceSystemDesc: ['System A'],
      itemCode: '123',
      itemName: 'Test Item',
      globalCategoryName: 'Category A',
      validationStatus: [ProductsMappingStatusEnum['Valid']]
    }));

    req.flush(new Blob());
  });

  it('should make a GET request global search', () => {

    service.globalSearch('', 20, 0).subscribe();

    const req = httpMock.expectOne(environment.apiUrl + '/api/ghm/items/global-search?globalSearchTerm=&pageSize=20&pageNumber=0');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should make a GET request and return filters', () => {
    const mockFilters = {
    };

    service.getFilters().subscribe((filters) => {
      expect(filters).toEqual(mockFilters);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/api/ghm/items/filters');
    expect(req.request.method).toBe('GET');
    req.flush(mockFilters);
  });

  it('should make a PATCH request to save changes', () => {
    const mockProduct: Partial<IProduct> = {
      id: 1,
      proposedCategoryName: { code: 'cat1', name: 'cat1' },
      proposedGroupName: { code: 'group1', name: 'group1' },
      proposedSubgroupName: { code: 'subgroup1', name: 'subgroup1' },
      comment: 'Test Comment',
    };

    const mockResponse = { id: 1, itemCode: '123', itemName: 'Test Item' };

    service.saveChanges(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/ghm/items/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      proposedCategoryCode: 'cat1',
      proposedGroupCode: 'group1',
      proposedSubgroupCode: 'subgroup1',
      proposedCategoryName: 'cat1',
      proposedGroupName: 'group1',
      proposedSubgroupName: 'subgroup1',
      comment: 'Test Comment',
    });

    req.flush(mockResponse);
  });

  it('should make a PATCH request to save changes with no data', () => {
    const mockProduct: Partial<IProduct> = {
      id: 1
    };

    service.saveChanges(mockProduct).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/ghm/items/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      proposedCategoryCode: '',
      proposedGroupCode: '',
      proposedSubgroupCode: '',
      proposedCategoryName: '',
      proposedGroupName: '',
      proposedSubgroupName: '',
      comment: '',
    });

    req.flush({});
  });

  it('should make a POST request to select all items', () => {
    const mockParams = {
      itemCode: '123',
      itemName: 'Test Item',
      selectedSourceSystems: ['System A'],
      selectedStatus: ['Valid'],
      pageSize: 10,
      pageNumber: 1,
    };

    const mockResponse = [{ id: 1, itemCode: '123', itemName: 'Test Item' }];

    service.selectAll(mockParams).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/ghm/items/select-all`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(expect.objectContaining({
      sourceSystemDesc: ['System A'],
      itemCode: '123',
      itemName: 'Test Item',
      validationStatus: [ProductsMappingStatusEnum['Valid']],
    }));

    req.flush(mockResponse);
  });
});
