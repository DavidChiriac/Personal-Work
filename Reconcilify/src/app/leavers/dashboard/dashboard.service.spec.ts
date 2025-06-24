import { DashboardService } from './dashboard.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ILeaversKpis } from './models/leavers-kpi.interface';
import { environment } from '../../../environments/environment';
import { ITask } from './models/tasks.interface';

const httpClientMock = {
  get: jest.fn()
} as unknown as jest.Mocked<HttpClient>;

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService(httpClientMock);
  });

  it('should call getDashboardData and return expected data', (done) => {
    const mockData: ILeaversKpis = {
      acknowledgementRate: 67,
      pendingAcknowledgementTasks: 1,
      previousDayLeavers: 0,
      currentWeekLeavers: 0,
      currentMonthLeavers: 1,
      yearToDateLeavers: 2,
      totalAcknowledgementTasks: 3,
      currentWeekBackdatedLeavers: 0
    };

    const apiUrl = environment.apiUrl + '/api/leavers/dashboard/metrics';

    httpClientMock.get.mockReturnValue(of(mockData));

    service.getDashboardData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientMock.get).toHaveBeenCalledWith(apiUrl);
      done();
    });
  });

  
  it('should get tasks', (done) => {
    const mockTasks: ITask[] = [{ id: 1, name: 'Task1' }] as any;

    service.getTasks().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const apiUrl = environment.apiUrl + '/api/leavers/dashboard/pending-tasks';

    httpClientMock.get.mockReturnValue(of(mockTasks));

    service.getDashboardData().subscribe(data => {
      expect(data).toEqual(mockTasks);
      expect(httpClientMock.get).toHaveBeenCalledWith(apiUrl);
      done();
    });
  });
});
