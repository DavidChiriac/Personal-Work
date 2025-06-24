import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { LeaverReportAcknowledgementService } from './leaver-report-acknowledgement.service';
import { environment } from '../../../environments/environment';
import { ILeaverReportAcknowledgement } from './models/leaver-report-acknowledgement.interface';
import { TestingModule } from '../../shared/testing.module';

describe('LeaverReportAcknowledgementService', () => {
  let service: LeaverReportAcknowledgementService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/api/leavers/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LeaverReportAcknowledgementService],
    });

    service = TestBed.inject(LeaverReportAcknowledgementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call globalSearch with correct params', () => {
    const mockResponse = {
      userAcknowledgementTaskViewDTOList: [],
      extendedFilterPageDTO: {},
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

  it('should call getTableData and return expected data', () => {
    const params = { pageSize: 10, pageNumber: 0 };
    const status = [1];
    const mockResponse = {
      userAcknowledgementTaskViewDTO: [],
      taskFilterDTO: {},
    };

    service.getTableData(params, status).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.status).toEqual(status);
    req.flush(mockResponse);
  });

  it('should call selectAll with correct body', () => {
    const params = { taskTitle: 'test' };
    const status = [1];
    const mockResponse = [1, 2, 3];

    service.selectAll(params, status).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/select-all`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.taskTitle).toBe('test');
    req.flush(mockResponse);
  });

  it('should call exportTableData and return a Blob', () => {
    const params = { taskTitle: 'Export' };
    const selectedItems = [{ id: 1 }];
    const mockBlob = new Blob(['test'], { type: 'application/json' });

    service.exportTableData(params, null, selectedItems).subscribe((res) => {
      expect(res.body).toEqual(mockBlob);
    });

    const req = httpMock.expectOne(`${apiUrl}/export`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('blob');
    req.flush(mockBlob);
  });

  it('should fetch filters', () => {
    const mockFilters = { someFilter: [] };

    service.getFilters().subscribe((res) => {
      expect(res).toEqual(mockFilters);
    });

    const req = httpMock.expectOne(`${apiUrl}/filters`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFilters);
  });

  it('should acknowledge a task', () => {
    const task: ILeaverReportAcknowledgement = {
      id: 123,
      taskTitle: '',
      week: {
        weekNumber: '1/25',
        retrievedOnFrom: '',
        retrievedOnTo: '',
      },
      weekNumber: '1/25',
      retrievedOnFrom: '',
      retrievedOnTo: '',
      createdOn: '',
      assignee: '',
      email: '',
      taskDescription: '',
      acknowledged: 0,
      acknowledgedBy: '',
      acknowledgedOn: '',
    };
    const mockResponse = { id: 123 };

    service.acknowledgeTask(task).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/123?status=2`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });
});
