import { TestBed, ComponentFixture } from '@angular/core/testing';
import { GlobalHierarchiesComponent } from './global-hierarchies.component';
import { GlobalHierarchiesService } from './global-hierarchies.service';
import { TimedSessionStorageService } from '../../shared/services/timed-session-storage.service';
import { of, throwError } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockService } from 'ng-mocks';
import { Table } from 'primeng/table';

const mockTimedSSService = MockService(TimedSessionStorageService, {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
});

const mockGlobalHierarchiesService = MockService(GlobalHierarchiesService, {
  getGlobalHierarchies: jest.fn().mockReturnValue(of()),
  exportTableData: jest.fn()
});

class MockTable {
  filters = {};

  filterGlobal = jest.fn();
  clear = jest.fn();
}

describe('GlobalHierarchiesComponent', () => {
  let component: GlobalHierarchiesComponent;
  let fixture: ComponentFixture<GlobalHierarchiesComponent>;
  let globalHierarchiesService: jest.Mocked<GlobalHierarchiesService>;
  let timedSSService: jest.Mocked<TimedSessionStorageService>;
  let mockTable: Partial<Table>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalHierarchiesComponent],
      providers: [
        {provide: GlobalHierarchiesService, useValue: mockGlobalHierarchiesService},
        {provide: TimedSessionStorageService, useValue: mockTimedSSService},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalHierarchiesComponent);
    component = fixture.componentInstance;
    globalHierarchiesService = TestBed.inject(GlobalHierarchiesService) as jest.Mocked<GlobalHierarchiesService>;
    timedSSService = TestBed.inject(TimedSessionStorageService) as jest.Mocked<TimedSessionStorageService>;
    mockTable = new MockTable();
    component.table = mockTable as unknown as Table;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch hierarchies data on initialization', () => {
    const mockData = [{
      id: 1,
      globalCategoryName: 'Category 1',
      globalCategoryCode: 'Category 1',
      globalGroupName: 'Group 1',
      globalGroupCode: 'Group 1',
      globalSubgroupName: 'Subgroup 1',
      globalSubgroupCode: 'Subgroup 1',
    }];
    timedSSService.getItem.mockReturnValue(null);
    globalHierarchiesService.getGlobalHierarchies.mockReturnValue(of(mockData));

    component.ngOnInit();

    expect(globalHierarchiesService.getGlobalHierarchies).toHaveBeenCalled();
    expect(component.tableData).toEqual(mockData.map((item => {
      return {
        id: item.id,
        globalCategoryName: {code: item.globalCategoryCode, name: item.globalCategoryName},
        globalGroupName: {code: item.globalGroupCode, name: item.globalGroupName},
        globalSubgroupName: {code: item.globalSubgroupCode, name: item.globalSubgroupName},
      };
    })));
    expect(component.tableFilters.globalCategoryName.length).toBe(1);
  });

  it('should fetch hierarchies data from the service if not available in session storage', () => {
    const mockHierarchies = [
      {
        id: 1,
        globalCategoryName: 'Category 1',
        globalCategoryCode: 'C1',
        globalGroupName: 'Group 1',
        globalGroupCode: 'G1',
        globalSubgroupName: 'Subgroup 1',
        globalSubgroupCode: 'S1',
      },
    ];

    globalHierarchiesService.getGlobalHierarchies.mockReturnValue(
      of(mockHierarchies)
    );

    timedSSService.getItem.mockReturnValue(null);

    component.ngOnInit();

    expect(globalHierarchiesService.getGlobalHierarchies).toHaveBeenCalled();
    expect(component.loading).toBeFalsy();
  });

  it('should sort table data in ascending order', () => {
    component.tableData = [
      {
        id: 2,
        globalCategoryName: { code: 'C2', name: 'Category 2' },
        globalGroupName: { code: 'G2', name: 'Group 2' },
        globalSubgroupName: { code: 'S2', name: 'Subgroup 2' },
      },
      {
        id: 1,
        globalCategoryName: { code: 'C1', name: 'Category 1' },
        globalGroupName: { code: 'G1', name: 'Group 1' },
        globalSubgroupName: { code: 'S1', name: 'Subgroup 1' },
      },
    ];

    component.onSort('globalCategoryName', new Event('click'));
    expect(component.tableData[0].globalCategoryName.name).toBe('Category 1');
  });

  it('should sort table data in descending order when already sorted ascending', () => {
    component.tableData = [
      {
        id: 1,
        globalCategoryName: { code: 'C1', name: 'Category 1' },
        globalGroupName: { code: 'G1', name: 'Group 1' },
        globalSubgroupName: { code: 'S1', name: 'Subgroup 1' },
      },
      {
        id: 2,
        globalCategoryName: { code: 'C2', name: 'Category 2' },
        globalGroupName: { code: 'G2', name: 'Group 2' },
        globalSubgroupName: { code: 'S2', name: 'Subgroup 2' },
      },
    ];

    component.onSort('globalCategoryName', new Event('click'));
    component.onSort('globalCategoryName', new Event('click'));

    expect(component.tableData[0].globalCategoryName.name).toBe('Category 2');
  });

  it('should handle error when fetching hierarchies data', () => {
    timedSSService.getItem.mockReturnValue(null);
    globalHierarchiesService.getGlobalHierarchies.mockReturnValue(throwError(() => new Error('Service error')));

    component.ngOnInit();

    expect(globalHierarchiesService.getGlobalHierarchies).toHaveBeenCalled();
  });

  it('should export table data on exportTableData call', () => {
    const response = new HttpResponse({
      body: new Blob(),
      headers: new HttpHeaders({ 'content-disposition': 'attachment; filename=test.csv' })
    });
    component.table.filters = {
      globalCategoryName: [{ value: ['Category A'] }],
      globalGroupName: { value: ['Group B'] },
      globalSubgroupName: [{ value: ['Subgroup C'] }]
    };

    globalHierarchiesService.exportTableData.mockReturnValue(of(response));

    component.exportTableData();

    expect(globalHierarchiesService.exportTableData).toHaveBeenCalledWith({
      selectedCategory: ['Category A'],
      selectedGroup: ['Group B'],
      selectedSubgroup: ['Subgroup C'],
    });
  });

  it('should throw error on table data export', () => {
    globalHierarchiesService.exportTableData.mockReturnValue(throwError(()=>{new Error();}));

    component.exportTableData();

    expect(component.errorMessage).toBe('There was an error while downloading the file');
    expect(component.errorModalVisible).toBeTruthy();
    expect(component.loading).toBeFalsy();
  });

  it('should toggle error modal visibility', () => {
    component.errorModalVisible = false;

    component.toggleErrorModal();
    expect(component.errorModalVisible).toBeTruthy();

    component.toggleErrorModal();
    expect(component.errorModalVisible).toBeFalsy();
  });
  
  it('should clear global search text and call filterGlobal', () => {
    component.globalSearchText = 'some search text';
    component.clearAll(mockTable as Table);

    expect(component.globalSearchText).toBe('');
    expect(mockTable.clear).toHaveBeenCalled();
  });
  
  it('should test empty filters method', () => {
    component.table.filteredValue = [{globalGroupName: { name: 'Group B', code: 'GrB' }}];

    component.checkEmptyFilters();
    expect(component.emptyFilters).toBeFalsy();

    component.table.filteredValue = null;
    
    component.checkEmptyFilters();
    expect(component.emptyFilters).toBeTruthy();
  });
});
