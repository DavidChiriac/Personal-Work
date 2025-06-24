import { TestBed } from '@angular/core/testing';
import { LeaverReportService } from './leaver-report.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { ILeaverReport } from './models/leaver-report.interface';
import { TestingModule } from '../../shared/testing.module';
import { LeaverReportFilters } from './models/leaver-report-table.filters';
import { IRequestParams } from '../../shared/interfaces/request-params.interface';

describe('LeaverReportService', () => {
  let service: LeaverReportService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/api/leavers';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LeaverReportService],
    });

    service = TestBed.inject(LeaverReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
      `${apiUrl}/global-search?globalSearchTerm=test&pageSize=10&pageNumber=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch table data', () => {
    const mockParams: Partial<IRequestParams & LeaverReportFilters> = {pageNumber: 1, pageSize: 50, filterPageDTO: {}, systemNames: undefined };
    const mockResponse = {
      leavers: [],
      filter: {},
    };

    service.getTableData(mockParams).subscribe();

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({filterPageDTO: {pageNumber: mockParams.pageNumber, pageSize: mockParams.pageSize}});
    req.flush(mockResponse);
  });

  it('should select all with filters', () => {
    const mockParams: Partial<LeaverReportFilters> = {
      sourceSystem: [{ id: 1, name: 'System 1' }],
      filterPageDTO: {
        pageNumber: 0,
        pageSize: 50
      }
    };
    const mockResponse = [1, 2, 3];

    service.selectAll(mockParams).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/select-all`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockParams);
    req.flush(mockResponse);
  });

  it('should send null if no filters are provided', () => {
    const mockResponse = [1, 2, 3];

    service.selectAll({}).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/select-all`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should export table data', () => {
    const mockParams: Partial<IRequestParams> = { pageNumber: 1, pageSize: 50 };
    const mockSelectedItems = [
      { id: 1 },
      { id: 2 },
    ] as Partial<ILeaverReport>[];
    const blob = new Blob(['dummy content'], {
      type: 'application/octet-stream',
    });

    service
      .exportTableData(mockParams, mockSelectedItems)
      .subscribe((response) => {
        expect(response.body).toEqual(blob);
      });

    const req = httpMock.expectOne(`${apiUrl}/export`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body.leaversFilterCriteriaDTO).toEqual({filterPageDTO: {...mockParams}});
    expect(req.request.body.selectedLeaverIds).toEqual([1, 2]);
    req.flush(blob);
  });

  it('should fetch filters', () => {
    const mockResponse = {
      statuses: ['Active', 'Inactive'],
    };

    service.getFilters().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/filters`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
