import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedServiceService } from '../../shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { TestingModule } from '../../shared/testing.module';
import { LeaverReportAcknowledgementService } from './leaver-report-acknowledgement.service';
import { LeaverReportAcknowledgementComponent } from './leaver-report-acknowledgement.component';
import { acknowledgementGlobalFilters } from './models/acknowledgement.global-filters';
import { ILeaverReportAcknowledgement } from './models/leaver-report-acknowledgement.interface';

const mockData: {
  tasks: ILeaverReportAcknowledgement[];
  pagination: { numberOfRecords: number };
} = {
  tasks: [
    {
      id: 1,
      week: {
        weekNumber: '1/25',
        retrievedOnFrom: '2024-12-27',
        retrievedOnTo: '2025-01-02',
      },
      weekNumber: '1/25',
      retrievedOnFrom: '2024-12-27',
      retrievedOnTo: '2025-01-02',
      createdOn: '2025-01-03',
      assignee: 'User Name',
      email: 'a@a.com',
      taskDescription: '',
      acknowledged: 1,
      acknowledgedBy: '',
      acknowledgedOn: '',
      taskTitle: ''
    },
  ],
  pagination: { numberOfRecords: 10 },
};

const mockLeaverReportAcknowledgementService = {
  getFilters: jest.fn().mockReturnValue(
    of({
      leaverCountDTO: {
        pendingTasks: 10,
        acknowledgedTasks: 90,
        allTasks: 100,
      },
    })
  ),
  globalSearch: jest.fn().mockReturnValue(of(mockData)),
  getTableData: jest.fn().mockReturnValue(of(mockData)),
  selectAll: jest
    .fn()
    .mockReturnValue(of(mockData.tasks.map((task) => task.id))),
  exportTableData: jest.fn(),
  acknowledgeTask: jest.fn(),
};

const mockSharedService = {
  formatDateFilters: jest.fn().mockImplementation((date) => date),
  handleLazyLoad: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

describe('LeaverReportAcknowledgementComponent', () => {
  let component: LeaverReportAcknowledgementComponent;
  let fixture: ComponentFixture<LeaverReportAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        {
          provide: LeaverReportAcknowledgementService,
          useValue: mockLeaverReportAcknowledgementService,
        },
        { provide: SharedServiceService, useValue: mockSharedService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ allTasks: 'true' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaverReportAcknowledgementComponent);
    component = fixture.componentInstance;

    component.globalFilters = [
      acknowledgementGlobalFilters.pendingTasks,
      acknowledgementGlobalFilters.acknowledgedTasks,
      acknowledgementGlobalFilters.allTasks
    ];
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error in getFilters gracefully', () => {
    mockLeaverReportAcknowledgementService.getFilters.mockReturnValue(
      throwError(() => new Error('Filters API failed'))
    );
    component.getFilters();
    expect(
      mockLeaverReportAcknowledgementService.getFilters
    ).toHaveBeenCalled();
  });

  it('should initialize filterNames and call getFilters', () => {
    const getFiltersSpy = jest.spyOn(component, 'getFilters');
    component.ngOnInit();
    expect(getFiltersSpy).toHaveBeenCalled();
    expect(component.filterNames.length).toBeGreaterThan(0);
  });

  it('should set globalFilters based on service response', () => {
    const mockFilterData = {
      taskCountDTO: {
        pendingTasks: 1,
        completedTasks: 2,
        allTasks: 3,
      },
    };
    mockLeaverReportAcknowledgementService.getFilters.mockReturnValue(
      of(mockFilterData)
    );
    component.getFilters();
    expect(
      mockLeaverReportAcknowledgementService.getFilters
    ).toHaveBeenCalled();
    expect(component.globalFilters).toEqual([
      {
        ...acknowledgementGlobalFilters.pendingTasks,
        count: mockFilterData.taskCountDTO.pendingTasks
      },
      {
        ...acknowledgementGlobalFilters.acknowledgedTasks,
        count: mockFilterData.taskCountDTO.completedTasks
      },
      {
        ...acknowledgementGlobalFilters.allTasks,
        count: mockFilterData.taskCountDTO.allTasks
      },
    ]);
  });

  it('should set globalFilters when service response is undefined', () => {
    const mockFilterData = {
      tasksCountDTO: undefined,
    };
    mockLeaverReportAcknowledgementService.getFilters.mockReturnValue(
      of(mockFilterData)
    );
    component.getFilters();
    expect(
      mockLeaverReportAcknowledgementService.getFilters
    ).toHaveBeenCalled();
    expect(component.globalFilters).toEqual([
      {
        ...acknowledgementGlobalFilters.pendingTasks,
        count: 0
      },
      {
        ...acknowledgementGlobalFilters.acknowledgedTasks,
        count: 0
      },
      {
        ...acknowledgementGlobalFilters.allTasks,
        count: 0
      },
    ]);
  });

  it('should populate tableData, totalRecords, and selectedQuickFilter correctly', () => {
    const mockData = {
      userAcknowledgementTaskViewDTO: [
        {
          weekNumber: '12/25',
          periodStart: '2024-03-18',
          periodEnd: '2024-03-24',
          status: 2,
          createdOn: '2024-03-01',
          acknowledgedOn: '2024-03-25',
        } as any,
      ],
      taskFilterDTO: {
        filterPageDTO: { numberOfRecords: 1 },
        status: [2],
      }
    };

    component.populateTableData(mockData);

    expect(component.tableData).toEqual([
      {
        ...mockData.userAcknowledgementTaskViewDTO[0],
        week: {
          weekNumber: '12/25',
          retrievedOnFrom: '2024-03-18',
          retrievedOnTo: '2024-03-24',
        },
        acknowledged: 2,
        createdOn: '2024-03-01',
        acknowledgedOn: '2024-03-25',
      }
    ]);

    expect(component.totalRecords).toBe(1);

    expect(component.selectedQuickFilter).toEqual(acknowledgementGlobalFilters.pendingTasks);
  });

  it('should default to "All Tasks" quick filter if multiple statuses', () => {
    const mockData = {
      userAcknowledgementTaskViewDTO: [],
      taskFilterDTO: {
        filterPageDTO: { numberOfRecords: 0 },
        status: [1],
      }
    };

    component.populateTableData(mockData);

    expect(component.selectedQuickFilter).toEqual(acknowledgementGlobalFilters.pendingTasks);
  });

  it('should default to 0 totalRecords if filterPageDTO is missing', () => {
    const mockData = {
      userAcknowledgementTaskViewDTO: [],
      taskFilterDTO: { status: [] }
    };

    component.populateTableData(mockData);

    expect(component.totalRecords).toBe(0);
  });

  it('should perform global search and populate table data', () => {
    mockLeaverReportAcknowledgementService.globalSearch.mockReturnValue(
      of(mockData)
    );
    component.globalSearchText = 'test';
    component.globalSearch();
    expect(
      mockLeaverReportAcknowledgementService.globalSearch
    ).toHaveBeenCalledWith('test', 0, 0);
  });

  it('should handle error in global search', () => {
    mockLeaverReportAcknowledgementService.globalSearch.mockReturnValue(
      throwError(() => new Error('Error'))
    );
    component.globalSearch();
    expect(component.loading).toBe(false);
  });

  it('should set loading false after successful global search', () => {
    const mockData = { taks: [], pagination: { numberOfRecords: 10 } };
    mockLeaverReportAcknowledgementService.globalSearch.mockReturnValue(
      of(mockData)
    );

    component.globalSearch();

    expect(component.loading).toBe(false);
  });

  it('should call getTableData and populate table', () => {
    component.fetchTableData();
    expect(
      mockLeaverReportAcknowledgementService.getTableData
    ).toHaveBeenCalled();
  });

  it('should call exportTableData and handle success', () => {
    const mockHttpResponse = {
      body: new Blob(['mock data']),
      headers: {
        get: (): string => 'attachment; filename="testfile.csv"',
      },
    };
    mockLeaverReportAcknowledgementService.exportTableData.mockReturnValue(
      of(mockHttpResponse as any)
    );
    component.exportData();
    expect(
      mockLeaverReportAcknowledgementService.exportTableData
    ).toHaveBeenCalled();
    expect(component.errorModalVisible).toBeFalsy();
  });

  it('should show error modal on export error', () => {
    mockLeaverReportAcknowledgementService.exportTableData.mockReturnValue(
      throwError(() => new Error())
    );
    component.exportData();
    expect(component.errorModalVisible).toBeTruthy();
  });

  it('should handle missing filename in export', () => {
    const mockHttpResponse = {
      body: new Blob(['mock data']),
      headers: {
        get: (): string => '',
      },
    };
    mockLeaverReportAcknowledgementService.exportTableData.mockReturnValue(
      of(mockHttpResponse as any)
    );

    component.exportData();

    expect(
      mockLeaverReportAcknowledgementService.exportTableData
    ).toHaveBeenCalled();
  });

  it('should clear all filters', () => {
    component.table = {
      clear: jest.fn(),
      clearFilterValues: jest.fn(),
    } as any as Table;
    component.globalSearchText = 'some search';
    component.requestParams.fieldToSort = 'name';
    component.clearFilters();
    expect(component.globalSearchText).toBe('');
    expect(component.requestParams.fieldToSort).toBe('');
  });

  it('should clear globalSearchText and perform global search', () => {
    const globalSearchSpy = jest.spyOn(component, 'globalSearch');
    component.clearGlobalSearchText();
    expect(component.globalSearchText).toBe('');
    expect(globalSearchSpy).toHaveBeenCalled();
  });

  it('should select all entries when onSelectAllChange event.checked is true', () => {
    const selectedIds = [1, 2];
    mockLeaverReportAcknowledgementService.selectAll.mockReturnValue(
      of(selectedIds)
    );
    const event = { checked: true } as any;

    component.onSelectAllChange(event);

    expect(mockLeaverReportAcknowledgementService.selectAll).toHaveBeenCalled();
  });

  it('should set allSelected true when all entries are selected', () => {
    const event = { checked: true } as any;
    mockLeaverReportAcknowledgementService.selectAll.mockReturnValue(of([]));

    component.onSelectAllChange(event);

    expect(component.allSelected).toBe(true);
  });

  it('should set allSelected false when deselecting all entries', () => {
    const event = { checked: false } as any;
    component.totalRecords = mockData.tasks.length;

    component.onSelectAllChange(event);

    expect(component.allSelected).toBe(false);
  });

  it('should handle error on select all', () => {
    mockLeaverReportAcknowledgementService.selectAll.mockReturnValue(
      throwError(() => new Error('Select all failed'))
    );
    const event = { checked: true } as any;

    component.onSelectAllChange(event);

    expect(mockLeaverReportAcknowledgementService.selectAll).toHaveBeenCalled();
  });

  it('should clear selection when onSelectAllChange event.checked is false', () => {
    const event = { checked: false } as any;
    component.selectedEntries = [{ id: 1 }];
    component.selectedEntriesList = [{ id: 1 }];

    component.onSelectAllChange(event);

    expect(component.selectedEntries).toEqual([]);
    expect(component.selectedEntriesList).toEqual([]);
  });

  it('should hide error modal', () => {
    component.errorModalVisible = true;

    component.toggleErrorModal();

    expect(component.errorModalVisible).toBe(false);
  });

  it('should normalize table filters and adjust date filters when normalizeTableFilters is called', () => {
    const event = {
      filters: { createdOn: '2025-01-01' },
    } as TableLazyLoadEvent;
    const processFiltersSpy = jest.spyOn(component, 'processFilters');

    component.tableFilters['createdOn'] = ['2025-01-01'];

    component.normalizeTableFilters(event);

    expect(processFiltersSpy).toHaveBeenCalled();
  });

  it('should call onLazyLoad when selectQuickFilter is called', () => {
    const onLazyLoadSpy = jest.spyOn(component, 'onLazyLoad');
    const quickFilter = {
      label: 'Quick Filter',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
    };
    component.table = {
      filters: {retrievedOn: []}
    } as any as Table;

    component.selectQuickFilter(quickFilter);

    expect(component.selectedQuickFilter).toEqual(quickFilter);
    expect(onLazyLoadSpy).toHaveBeenCalled();
  });

  it('should acknowledge a task', () => {
    const task = { id: 1 } as any;
    mockLeaverReportAcknowledgementService.acknowledgeTask.mockReturnValue(
      of(task)
    );

    component.acknowledgeTask(task);

    expect(
      mockLeaverReportAcknowledgementService.acknowledgeTask
    ).toHaveBeenCalled();
  });

  it('should navigate to leavers report', () => {
    const week = {
      weekNumber: '10/24',
      retrievedOnFrom: '2024-03-01',
      retrievedOnTo: '2024-03-07',
    };

    component.viewLeaversList(week);

    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});
