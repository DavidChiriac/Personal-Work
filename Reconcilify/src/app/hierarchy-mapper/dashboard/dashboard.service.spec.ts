import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { FnBDashboardService } from './dashboard.service';
import { ISystemMetrics } from '../models/system-metrics.interface';
import { environment } from '../../../environments/environment';
import { TestingModule } from '../../shared/testing.module';

describe('FnBDashboardService', () => {
  let service: FnBDashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [FnBDashboardService],
    });
    service = TestBed.inject(FnBDashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return dashboard data when getDashboardData is called', () => {
    const mockData: { systemMetrics: ISystemMetrics[] } = {
      systemMetrics: [
        {
          systemCode: 1,
          systemName: 'System A',
          totalProductsNumber: 100,
          totalCorrectlyClassified: 90,
          totalClassificationIssues: 10,
          missingClassification: 5,
          incorrectClassification: 3,
          classificationStatusComplianceScore: 0,
        },
        {
          systemCode: 2,
          systemName: 'System B',
          totalProductsNumber: 150,
          totalCorrectlyClassified: 130,
          totalClassificationIssues: 20,
          missingClassification: 10,
          incorrectClassification: 7,
          classificationStatusComplianceScore: 0,
        },
      ],
    };

    service.getDashboardData().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/ghm/dashboard`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData); // Mock the response
  });

  it('should handle errors correctly', () => {
    const errorMessage = 'Failed to load data';

    service.getDashboardData().subscribe({
      next: () => fail('should have failed with the error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/ghm/dashboard`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
