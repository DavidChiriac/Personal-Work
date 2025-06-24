import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaverReportComponent } from './leaver-report.component';
import { LeaverReportService } from './leaver-report.service';
import { SharedServiceService } from '../../shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Table } from 'primeng/table';
import { TestingModule } from '../../shared/testing.module';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ILeaverReport } from './models/leaver-report.interface';
import { SortDirectionEnum } from '../../shared/utils/sort-directions';

const mockLeaverReportService = {
  getFilters: jest.fn().mockReturnValue(
    of({
      leaverCountDTO: {
        previousDayLeavers: 10,
        currentWeekLeavers: 30,
        totalLeavers: 100,
      },
    })
  ),
  globalSearch: jest.fn().mockReturnValue(of()),
  getTableData: jest.fn(),
  selectAll: jest.fn(),
  exportTableData: jest.fn(),
};

const mockSharedService = {
  formatDateFilters: jest.fn().mockImplementation((date) => date),
};

describe('LeaverReportComponent', () => {
  let component: LeaverReportComponent;
  let fixture: ComponentFixture<LeaverReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        { provide: LeaverReportService, useValue: mockLeaverReportService },
        { provide: SharedServiceService, useValue: mockSharedService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ retrievedOnFrom: '2024-01-01', retrievedOnTo: '2024-01-10', isBackdatedLeaver: 'true' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaverReportComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize filterNames and call getFilters', () => {
    const getFiltersSpy = jest.spyOn(component, 'getFilters');
    component.ngOnInit();
    expect(getFiltersSpy).toHaveBeenCalled();
    expect(component.filterNames.length).toBeGreaterThan(0);
  });

  it('should set globalFilters based on service response', () => {
    const mockFilterData = {
      leaverCountDTO: {
        previousDayLeavers: 1,
        currentWeekLeavers: 2,
        totalLeavers: 3,
      },
      filterValues: {
        systemNames: [],
        backdatedLeavers: []
      }
    };
    mockLeaverReportService.getFilters.mockReturnValue(of(mockFilterData));
    component.getFilters();
    expect(mockLeaverReportService.getFilters).toHaveBeenCalled();
    expect(component.tableFilters.isBackdatedLeaver).toStrictEqual(mockFilterData.filterValues.backdatedLeavers);
  });

  it('should set queryParams correctly', () => {
    component.getQueryParams();
    expect(component.queryParams.retrievedOnFrom).toBe('2024-01-01');
    expect(component.queryParams.retrievedOnTo).toBe('2024-01-10');
    expect(component.queryParams.isBackdatedLeaver).toBe('true');
  });

  it('should perform global search and populate table data', () => {
    const mockData = { leavers: [], pagination: { numberOfRecords: 10 } };
    const tableFiltersSpy = jest.spyOn(component.tableFilters, 'emptyFilters');
    component.table = {
      clearFilterValues: jest.fn(),
    } as any as Table;

    mockLeaverReportService.globalSearch.mockReturnValue(of(mockData));
    component.globalSearchText = 'test';
    component.globalSearch('test');
    expect(mockLeaverReportService.globalSearch).toHaveBeenCalledWith(
      'test',
      0,
      0
    );
    expect(tableFiltersSpy).toHaveBeenCalled();
    expect(component.table.clearFilterValues).toHaveBeenCalled();
    expect(component.globalSearchText).toBe('test');
  });

  it('should handle error in global search', () => {
    mockLeaverReportService.globalSearch.mockReturnValue(
      throwError(() => new Error('Error'))
    );
    component.globalSearch();
    expect(component.loading).toBe(false);
  });

  it('should call getTableData and populate table', async () => {
    const mockResponse = {
      leavers: [{ id: 1, systemId: 2 }],
      filter: {
        extendedFilterPageDTO: { numberOfRecords: 1 },
        sourceSystem: [{ id: 2, name: 'Test System' }],
      },
    };
    component.table = {
      filters: {},
    } as any as Table;
    component.queryParams = {isBackdatedLeaver: 'true'};
    const applyQueryParamsSpy = jest.spyOn(component, 'applyQueryParamsFilters');


    mockLeaverReportService.getTableData.mockReturnValue(of(mockResponse));
    await component.fetchTableData();
    expect(mockLeaverReportService.getTableData).toHaveBeenCalled();
    expect(applyQueryParamsSpy).toHaveBeenCalled();
    expect(component.queryParams.isBackdatedLeaver).toBeUndefined();
  });

  it('should call exportTableData and handle success', () => {
    const mockHttpResponse = {
      body: new Blob(['mock data']),
      headers: {
        get: (): string => 'attachment; filename="testfile.csv"',
      },
    };
    mockLeaverReportService.exportTableData.mockReturnValue(
      of(mockHttpResponse as any)
    );
    component.exportData();
    expect(mockLeaverReportService.exportTableData).toHaveBeenCalled();
  });

  it('should show error modal on export error', () => {
    mockLeaverReportService.exportTableData.mockReturnValue(
      throwError(() => ({
        status: 400,
        error: new Blob(['{"message":"Invalid"}'], {
          type: 'application/json',
        }),
      }))
    );
    component.exportData();
    expect(component.errorModalVisible).toBe(true);
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

  it('should call updateRequestParamsFromEvent and normalizeTableFilters when event is provided', () => {
    const updateRequestParamsFromEvent = jest.spyOn(component, 'updateRequestParamsFromEvent');
    const normalizeTableFilters = jest.spyOn(component, 'normalizeTableFilters');
    const globalSearch = jest.spyOn(component, 'globalSearch');
    const fetchTableData = jest.spyOn(component, 'fetchTableData');
    component.table = {
      clearFilterValues: jest.fn(),
    } as any as Table;

    const event = {first: {}} as object;
    component.tableFilters.filtersAreEmpty= (): boolean => false;
    component.globalSearchText = 'test';

    component.onLazyLoad(event);

    expect(updateRequestParamsFromEvent).toHaveBeenCalledWith(event);
    expect(normalizeTableFilters).toHaveBeenCalledWith(event);
    expect(globalSearch).not.toHaveBeenCalled();
    expect(fetchTableData).toHaveBeenCalled();
  });

  it('should call globalSearch if globalSearchText is not empty and filtersAreEmpty() returns true', () => {
    const globalSearch = jest.spyOn(component, 'globalSearch');
    const fetchTableData = jest.spyOn(component, 'fetchTableData');

    component.tableFilters.filtersAreEmpty = jest.fn().mockReturnValue(true);
    component.globalSearchText = 'search text';

    component.onLazyLoad();

    expect(globalSearch).toHaveBeenCalled();
    expect(fetchTableData).not.toHaveBeenCalled();
  });

  it('should update sort direction correctly', () => {
    component.requestParams = {
      fieldToSort: '',
      sortDirection: '',
      pageNumber: 0,
      pageSize: 50,
      globalSearchInput: '',
    };

    const clickEvent = new Event('click');
    component.onSort({field: 'name', event: clickEvent});

    expect(component.requestParams.fieldToSort).toBe('name');
    expect(component.requestParams.sortDirection).toBe(SortDirectionEnum.ASC);

    component.onSort({field: 'name', event: clickEvent});
    expect(component.requestParams.fieldToSort).toBe('name');
    expect(component.requestParams.sortDirection).toBe(SortDirectionEnum.DESC);

    component.onSort({field: 'name', event: clickEvent});
    expect(component.requestParams.fieldToSort).toBe('');
    expect(component.requestParams.sortDirection).toBe('');
  });

  it('should format seconds into MM:SS format correctly', () => {
    expect(component.transform(0)).toBe('00:00');
    expect(component.transform(5)).toBe('00:05');
    expect(component.transform(60)).toBe('01:00');
  });

  it('should adjust range date filter correctly with both dates', () => {
    component.tableFilters['retrievedOn'] = ['2025-01-01', '2025-01-10'];

    component.adjustRangeDateFilter('retrievedOn');

    expect(component.tableFilters['retrievedOnFrom']).toBe('2025-01-01');
    expect(component.tableFilters['retrievedOnTo']).toBe('2025-01-10');
  });

  it('should adjust range date filter correctly with only one date', () => {
    component.tableFilters['retrievedOn'] = ['2025-01-01'];

    component.adjustRangeDateFilter('retrievedOn');

    expect(component.tableFilters['retrievedOnFrom']).toBe('2025-01-01');
    expect(component.tableFilters['retrievedOnTo']).toBe('2025-01-01');
  });

  it('should do nothing if no date is provided', () => {
    component.tableFilters['retrievedOn'] = null;


    component.adjustRangeDateFilter('retrievedOn');

    expect(component.tableFilters['retrievedOnFrom']).toBeNull();
    expect(component.tableFilters['retrievedOnTo']).toBeNull();
  });

  it('should start and stop a timer', async () => {
    component.startTimer();

    expect(component.time).toBe(0);
    expect(component.display).toBe('00:00');

    component.stopTimer();

    expect(component.time).toBe(0);
    expect(component.display).toBe('00:00');
  });

  it('should populate table data and persist selected rows', () => {
    const data = { leavers: [], leaverFilterCriteria: {} };
    const populateSpy = jest.spyOn(component, 'populateTableData');
    const persistSelectedRowsSpy = jest.spyOn(component, 'persistSelectedRows');

    component.handleDataResponse(data);

    expect(populateSpy).toHaveBeenCalledWith(data);
    expect(persistSelectedRowsSpy).toHaveBeenCalled();
  });

  it('should call saveAs on successful export', async () => {
    const response = new HttpResponse({
      body: new Blob(),
      headers: new HttpHeaders({
        'content-disposition': 'attachment; filename=test.csv',
      }),
    });

    mockLeaverReportService.exportTableData.mockReturnValue(of(response));

    component.exportData(true);

    expect(component.errorMessage).toBe('');
    expect(component.errorModalVisible).toBe(false);
  });

  it('should handle export errors correctly', async () => {
    const errorBlob = new Blob(
      [JSON.stringify({ message: 'Invalid request' })],
      { type: 'application/json' }
    );

    mockLeaverReportService.exportTableData.mockReturnValue(
      throwError(() => ({
        error: errorBlob,
        status: 400,
      }))
    );

    component.exportData(true);

    expect(component.errorModalVisible).toBe(true);
  });

  it('should update selected entries and table data', () => {
    const event = { data: { id: 1 } } as any;

    component.onRowSelect(event);

    expect(component.selectedEntries).toEqual([{ id: 1 }]);
    expect(component.allSelected).toBe(true);
  });

  it('should remove unselected entry from selected entries', () => {
    const event = { data: { id: 1 } } as any;

    component.onRowUnselect(event);

    expect(component.selectedEntries).toEqual([]);
    expect(component.selectedEntriesList).toEqual([]);
  });

  it('should persist selected rows correctly', () => {
    component.selectedEntries = [{ id: 1 }];
    component.tableData = [
      { id: 1 } as ILeaverReport,
      { id: 2 } as ILeaverReport,
    ];
    component.totalRecords = 2;
    component.allSelected = false;

    component.persistSelectedRows();

    expect(component.selectedEntriesList.length).toBe(1);
    expect(component.allSelected).toBe(false);
  });

  it('should process filters correctly', () => {
    const filters = {
      name: { value: 'John' },
      age: [{ value: 30 }],
    };

    component.processFilters(filters);

    expect(component.tableFilters).toEqual(
      expect.objectContaining({
        name: 'John',
        age: 30,
      })
    );
  });
});
