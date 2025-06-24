import { TestBed } from '@angular/core/testing';
import { LeaversService } from './leavers.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { SharedServiceService } from '../shared/services/shared.service';
import { INotificationsFilters } from './dashboard/models/notifications.filters';
import { INotification } from './dashboard/models/notification.interface';
import { TestingModule } from '../shared/testing.module';
import { NotificationTypeEnum } from './dashboard/models/notification.type';

const mockRouter = {
  navigateByUrl: jest.fn(() => Promise.resolve(true)),
  navigate: jest.fn(() => Promise.resolve(true)),
  url: '',
};

const mockSharedService = {
  formatDateFilters: jest.fn((date: string) => date),
};

describe('LeaversService', () => {
  let service: LeaversService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        LeaversService,
        { provide: Router, useValue: mockRouter },
        { provide: SharedServiceService, useValue: mockSharedService },
      ],
    });

    service = TestBed.inject(LeaversService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get number of tasks', () => {
    const mockNumber = {pendingTasks: 5};

    service.getNoTasks().subscribe((noOfTasks) => {
      expect(noOfTasks).toBe(mockNumber.pendingTasks);
    });

    const req = httpMock.expectOne(`${service.apiUrl}leavers/dashboard/pending-tasks/count`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNumber);
  });

  it('should get number of notifications', () => {
    const mockNumber = 3;

    service.getNoOfNotifications().subscribe((noOfNotifications) => {
      expect(noOfNotifications).toBe(mockNumber);
    });

    const req = httpMock.expectOne(`${service.apiUrl}notifications/count`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNumber);
  });

  it('should post filtered notifications', () => {
    const filters: INotificationsFilters = { type: 'day' } as any;
    const mockNotifications: INotification[] = [
      { id: 1, type: 'newLeavers' },
    ] as any;

    service.getFilteredNotifications(filters).subscribe((notifications) => {
      expect(notifications).toEqual(mockNotifications);
    });

    const req = httpMock.expectOne(`${service.apiUrl}notifications`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(
      {
        fieldToSort: filters.fieldToSort,
        sortDirection: filters.sortDirection,
        extendedFilterPageDTO: {
          pageSize: filters.pageSize,
          pageNumber: filters.pageNumber
        }
      }
    );
    req.flush(mockNotifications);
  });

  it('should patch notification as read', () => {
    const notification: INotification = { id: 1, type: 'newLeavers' } as any;

    service.markNotificationAsRead(notification).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service.apiUrl}notifications/${notification.id}/read`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should navigate to tasks page with allTasks query param', () => {
    service.navigateToTasks(true);

    expect(router.navigate).toHaveBeenCalledWith(
      ['/leavers/leaver-report-acknowledgement'],
      {
        queryParams: { allTasks: true },
      }
    );
  });

  it('should navigate to tasks page without query param', () => {
    service.navigateToTasks(false);

    expect(router.navigate).toHaveBeenCalledWith([
      '/leavers/leaver-report-acknowledgement',
    ]);
  });

  it('should navigate to leaver report based on filter: day', () => {
    service.navigateToLeaverReport('day');

    expect(router.navigate).toHaveBeenCalledWith(['/leavers/leaver-report'], {
      queryParams: expect.objectContaining({
        retrievedOnFrom: expect.any(String),
      }),
    });
  });

  it('should navigate to leaver report based on filter: week', () => {
    service.navigateToLeaverReport('week');

    expect(router.navigate).toHaveBeenCalledWith(['/leavers/leaver-report'], {
      queryParams: expect.objectContaining({
        retrievedOnFrom: expect.any(String),
        retrievedOnTo: expect.any(String),
      }),
    });
  });

  it('should navigate to leaver report based on filter: backdated', () => {
    service.navigateToLeaverReport('backdated');

    expect(router.navigate).toHaveBeenCalledWith(['/leavers/leaver-report'], {
      queryParams: expect.objectContaining({
        retrievedOnFrom: expect.any(String),
        retrievedOnTo: expect.any(String),
        isBackdatedLeaver: true
      }),
    });
  });

  it('should navigate to leaver report based on filter: month', () => {
    service.navigateToLeaverReport('month');

    expect(router.navigate).toHaveBeenCalledWith(['/leavers/leaver-report'], {
      queryParams: expect.objectContaining({
        retrievedOnFrom: expect.any(String),
        retrievedOnTo: expect.any(String),
      }),
    });
  });

  it('should navigate to leaver report based on filter: year', () => {
    service.navigateToLeaverReport('year');

    expect(router.navigate).toHaveBeenCalledWith(['/leavers/leaver-report'], {
      queryParams: expect.objectContaining({
        retrievedOnFrom: expect.any(String),
        retrievedOnTo: expect.any(String),
      }),
    });
  });

  it('should navigate to default leaver report when filter is unknown', () => {
    service.navigateToLeaverReport('unknown');

    expect(router.navigate).toHaveBeenCalledWith(['/leavers/leaver-report']);
  });

  it('should refresh and navigate to leaver report for NEW_LEAVERS if already on the report page', async () => {
    const notification = {
      type: NotificationTypeEnum.NEW_LEAVERS,
      periodStart: '2024-01-01',
      periodEnd: '2024-01-31',
    };

    mockRouter.url = '/leavers/leaver-report';

    await service.seeNotification(notification as INotification);

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/', {
      skipLocationChange: true,
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/leavers/leaver-report'],
      {
        queryParams: {
          retrievedOnFrom: '2024-01-01',
          retrievedOnTo: '2024-01-31',
        },
      }
    );
  });

  it('should navigate to leaver-report-acknowledgement directly for PENDING_TASKS', () => {
    const notification = { type: NotificationTypeEnum.PENDING_TASKS };
    mockRouter.url = '/some-other-page';

    service.seeNotification(notification as INotification);

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/leavers/leaver-report-acknowledgement',
    ]);
  });

  it('should refresh and navigate to leaver report with backdated=true for BACKDATED_LEAVERS', () => {
    const notification = {
      type: NotificationTypeEnum.BACKDATED_LEAVERS,
      periodStart: '2024-02-01',
      periodEnd: '2024-02-28',
    };

    service.seeNotification(notification as INotification);

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/leavers/leaver-report'],
      {
        queryParams: {
          retrievedOnFrom: '2024-02-01',
          retrievedOnTo: '2024-02-28',
          isBackdatedLeaver: true,
        },
      }
    );
    mockRouter.url = '/leavers/leaver-report';

    service.seeNotification(notification as INotification);

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/', {
      skipLocationChange: true,
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/leavers/leaver-report'],
      {
        queryParams: {
          retrievedOnFrom: '2024-02-01',
          retrievedOnTo: '2024-02-28',
          isBackdatedLeaver: true,
        },
      }
    );
  });

  it('should do nothing for unsupported notification types', async () => {
    const notification = { type: 'UNKNOWN_TYPE' };

    await service.seeNotification(notification as INotification);

    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });
});
