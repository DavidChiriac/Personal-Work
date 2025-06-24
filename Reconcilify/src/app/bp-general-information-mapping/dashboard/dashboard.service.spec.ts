import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { environment } from '../../../environments/environment';
import { IVendorCustomerSummary } from './vendor-customer-summary/models/vendor-customer-summary.interface';
import { TestingModule } from '../../shared/testing.module';

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [DashboardService],
    });
    dashboardService = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', (): void => {
    expect(dashboardService).toBeTruthy();
  });

  it('should call downloadTemplate successfully', () => {
    // Arrange
    const mockResponse = new Blob(['mock data'], {
      type: 'application/octet-stream',
    });

    // Act
    dashboardService.downloadTemplate().subscribe();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/data/download-template`
    );

    // Assert
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob' as 'json');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should call getSummaryData successfully', () => {
    // Arrange
    const mockSummaryData: IVendorCustomerSummary[] = [
      {
        status: '',
        sapCorp: 0,
        sapGamma: 0,
        sapAmica: 0,
        peopleSoft: 0,
      },
    ];

    // Act
    dashboardService.getSummaryData().subscribe((data) => {
      expect(data).toEqual(mockSummaryData);
    });
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/vcm/dashboard/aggregations`
    );

    // Assert
    expect(req.request.method).toBe('GET');
    req.flush(mockSummaryData);
  });

  it('should call uploadVendorCustomersFile successfully', () => {
    // Arrange
    const mockFile = new File(['mocked file content'], 'test-file.txt');
    const fileForm = new FormData();
    fileForm.append('file', mockFile);

    // Act
    dashboardService
      .uploadVendorCustomersFile(fileForm)
      .subscribe((response) => {
        expect(response).toBe(fileForm);
      });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/vcm/data/upload`);

    // Assert
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(fileForm);
    req.flush(fileForm);
  });
});
