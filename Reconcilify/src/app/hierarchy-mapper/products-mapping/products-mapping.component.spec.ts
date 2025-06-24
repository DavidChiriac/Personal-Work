 
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductsMappingComponent } from './products-mapping.component';
import { ProductsMappingService } from './products-mapping.service';
import { of, throwError } from 'rxjs';
import {
  Table,
  TableLazyLoadEvent,
  TableRowSelectEvent,
  TableSelectAllChangeEvent,
} from 'primeng/table';
import { MockService } from 'ng-mocks';
import { TestingModule } from '../../shared/testing.module';
import { SessionStorageService } from 'ngx-webstorage';
import { ProductsMappingStatusEnum } from './models/products-mapping-status.enum';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { SortDirectionEnum } from '../../shared/utils/sort-directions';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { IProduct } from './models/products-mapping-table.interface';
import { GlobalHierarchiesService } from '../global-hierarchies/global-hierarchies.service';
import { InvalidReasonTypeEnum } from './models/invalidity-reason-type.enum';

jest.mock('ngx-webstorage');

const mockProductMappingService = MockService(ProductsMappingService, {
  getTableData: jest.fn().mockReturnValue(of()),
  getFilters: jest.fn().mockReturnValue(of()),
  saveChanges: jest.fn().mockReturnValue(of()),
  selectAll: jest.fn().mockReturnValue(of([])),
  exportTableData: jest.fn().mockReturnValue(of([])),
  globalSearch: jest.fn().mockReturnValue(of())
});

const mockGlobalHierarchiesService = MockService(GlobalHierarchiesService, {
  getGlobalHierarchies: jest.fn().mockReturnValue(of()),
});

describe('ProductsMappingComponent', () => {
  let component: ProductsMappingComponent;
  let fixture: ComponentFixture<ProductsMappingComponent>;
  let sessionStorageServiceMock: SessionStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        {
          provide: ProductsMappingService,
          useValue: mockProductMappingService,
        },
        {
          provide: GlobalHierarchiesService,
          useValue: mockGlobalHierarchiesService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ system: 'any', invalidReason: 'someReason' })
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsMappingComponent);
    component = fixture.componentInstance;
    sessionStorageServiceMock = TestBed.inject(SessionStorageService);
    component.queryParams = {selectedSourceSystems: '', invalidReason: ''};
  });

  it('should set queryParams valid to true when valid param is true', () => {
    component.getQueryParams();
    expect(component.queryParams.selectedSourceSystems).toBe(undefined);
  });

  it('should set queryParams invalidReason correctly from query params', () => {
    component.getQueryParams();
    expect(component.queryParams.invalidReason).toBe('someReason');
  });

  it('should reset queryParams valid and invalidReason if query params are missing', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.queryParams = of({});
    fixture.detectChanges();

    component.getQueryParams();

    expect(component.queryParams.selectedSourceSystems).toBe(undefined);
    expect(component.queryParams.invalidReason).toBe(undefined);
  });

  it('should reset the window history state', () => {
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState');
    component.getQueryParams();
    expect(replaceStateSpy).toHaveBeenCalledWith({}, '', window.location.href.split('?')[0]);
  });

  it('should fetch table variables', () => {
    jest.spyOn(sessionStorageServiceMock, 'retrieve').mockReturnValue(null);
    const categoryGroupMapping = jest.spyOn(
      component,
      'getCategoryGroupSubgroupMatching'
    );
    const getFilters = jest.spyOn(component, 'getFilters');
    const getFiltersEndpoint = jest
      .spyOn(mockProductMappingService, 'getFilters')
      .mockReturnValue(
        of({
          filterValues: { validationStatus: [1], sourceSystemDesc: ['1'] },
          itemCountDTO: {
            totalValidItems: 1,
            totalInvalidItems: 0,
            totalPendingItems: 0,
            totalItems: 1,
          },
        })
      );

    component.ngOnInit();

    expect(component.noOfFrozenColumns).toBeFalsy();
    expect(component.frozenColumns.length).toBe(0);
    expect(categoryGroupMapping).toHaveBeenCalled();
    expect(getFilters).toHaveBeenCalled();
    expect(getFiltersEndpoint).toHaveBeenCalled();
    expect(component.tableFilters.validationStatus).toEqual([
      ProductsMappingStatusEnum[1],
    ]);
    expect(component.tableFilters.sourceSystemDesc).toStrictEqual(['1']);
  });

  it('should fetch new order of table columns', () => {
    jest.spyOn(sessionStorageServiceMock, 'retrieve').mockReturnValue({
      newColumnsOrder: [
        { field: 'col1', header: 'Col 1' },
        { field: 'col2', header: 'Col 2' },
      ],
      frozenColumns: [{ field: 'col1', header: 'Col 1' }],
      noOfFrozenColumns: 1,
    });

    component.ngOnInit();

    expect(component.noOfFrozenColumns).toBe(1);
    expect(component.frozenColumns).toStrictEqual([
      { field: 'col1', header: 'Col 1' },
    ]);
    expect(component.newOrderTableColumns).toStrictEqual([
      { field: 'col1', header: 'Col 1' },
      { field: 'col2', header: 'Col 2' },
    ]);
  });

  it('should fetch cached category-group-subgroup mapping', () => {
    const globalHierarchies = {
      value: {
        hierarchies: [
          {
            category: {
              code: 'cat1',
              name: 'cat1',
            },
            group: {
              code: 'g1',
              name: 'g1',
            },
            subgroup: {
              code: 's1',
              name: 's1',
            },
          },
          {
            category: {
              code: 'cat1',
              name: 'cat1',
            },
            group: {
              code: 'g11',
              name: 'g11',
            },
            subgroup: {
              code: 's111',
              name: 's111',
            },
          },
        ],
        categories: [
          { code: 'cat1', name: 'cat1' },
          { code: 'cat2', name: 'cat2' },
        ],
      }
    };

    jest.spyOn(sessionStorageServiceMock, 'retrieve').mockReturnValue(globalHierarchies);

    component.ngOnInit();

    expect(component.categoryGroupSubgroupMapping).toStrictEqual(globalHierarchies.value.hierarchies);
  });

  it('should search globally', () => {
    jest
      .spyOn(mockProductMappingService, 'globalSearch')
      .mockReturnValue(of({ items: [], pagination: {numberOfRecords: 0} }));
    
    jest.spyOn(component, 'populateTableData');
    component.globalSearchText = 'abc';

    component.onLazyLoad();

    expect(mockProductMappingService.globalSearch).toHaveBeenCalled();
    expect(component.emptyFilters).toBeFalsy();
    expect(component.populateTableData).toHaveBeenCalledWith({items: [], filter: {extendedFilterPageDTO: {numberOfRecords: 0}}});
  });

  it('should fetch data with updated request parameters', () => {
    jest
      .spyOn(mockProductMappingService, 'getTableData')
      .mockReturnValue(of({ items: [], filter: {} }));

    const mockEvent: TableLazyLoadEvent = {
      first: 0,
      rows: 10,
      filters: {
        globalCategoryName: { value: 'Test Category' },
        lastUpdatedAt: { value: '2025-01-17' },
        retrievedOn: { value: '2025-01-17' },
      },
    };

    component.onLazyLoad(mockEvent);

    expect(mockProductMappingService.getTableData).toHaveBeenCalledWith(
      expect.objectContaining({
        lastUpdatedAt: '2025-01-18',
        retrievedOn: '2025-01-18',
      })
    );
  });

  it('should fetch data with updated request parameters and export', () => {
    jest
      .spyOn(mockProductMappingService, 'exportTableData')
      .mockReturnValue(of(new HttpResponse<object>()));

    component.toggleExportDialog();
    expect(component.exportDialogVisible).toBeTruthy();

    const mockEvent: TableLazyLoadEvent = {
      first: 0,
      rows: 10,
      filters: {
        globalCategoryName: { value: 'Test Category' },
        lastUpdatedAt: { value: '2025-01-17' },
        retrievedOn: { value: '2025-01-17' },
      },
    };

    component.onLazyLoad(mockEvent);
    component.exportData(true);

    expect(mockProductMappingService.exportTableData).toHaveBeenCalledWith(
      expect.objectContaining({
        globalCategoryName: 'Test Category',
        lastUpdatedAt: '2025-01-18',
        retrievedOn: '2025-01-18',
      }
      ), null);
  });

  it('should throw export error', async() => {
    const errorBlob = new Blob(
      [JSON.stringify({ message: 'Error from blob!' })], 
      { type: 'application/json' }
    );
    jest.spyOn(errorBlob, 'text').mockReturnValue(Promise.resolve(JSON.stringify({ message: 'Error from blob!' })));
    const mockError = {
      status: 400,
      error: errorBlob,
    };

    jest.spyOn(mockProductMappingService, 'exportTableData').mockReturnValue(throwError(() => mockError));

    component.exportData(true);

    await fixture.whenStable();
    expect(component.errorMessage).toBe('Error from blob!');
    expect(component.errorModalVisible).toBeTruthy();

    component.toggleErrorModal();
    expect(component.errorModalVisible).toBeFalsy();

    component.selectedEntries = new Array(15000);
    component.exportData();

    expect(component.errorMessage).toBe('10.000 records or more are selected. The maximum limit is 10.000');
    expect(component.errorModalVisible).toBeTruthy();

    component.toggleErrorModal();
    expect(component.errorModalVisible).toBeFalsy();
  });

  it('should fetch data with updated request parameters and query params', () => {
    jest
      .spyOn(mockProductMappingService, 'getTableData')
      .mockReturnValue(of({ items: [], filter: {} }));

    component.globalFilters = [];

    const mockEvent: TableLazyLoadEvent = {
      first: 0,
      rows: 10,
      filters: {
        globalCategoryName: { value: 'Test Category' },
        lastUpdatedAt: { value: '2025-01-17' },
        retrievedOn: { value: '2025-01-17' },
      },
    };

    component.queryParams = {
      selectedSourceSystems: 'any',
      invalidReason: ''
    };
    component.onLazyLoad(mockEvent);

    expect(component.queryParams.selectedSourceSystems).toBe('any');

    component.queryParams = {
      selectedSourceSystems: '',
      invalidReason: 'incorrect'
    };
    component.onLazyLoad(mockEvent);

    expect(component.queryParams.selectedSourceSystems).toBe('');
    expect(component.tableFilters.invalidityReasonTypes).toStrictEqual([InvalidReasonTypeEnum.INCORRECT_CODE_NAME_RELATIONSHIP, InvalidReasonTypeEnum.INCORRECT_NAME_VALUE, InvalidReasonTypeEnum.LEVEL_RELATIONSHIP_MISMATCH]);
  

    component.queryParams = {
      selectedSourceSystems: '',
      invalidReason: 'missing'
    };
    component.onLazyLoad(mockEvent);

    expect(component.queryParams.selectedSourceSystems).toBe('');
    expect(component.tableFilters.invalidityReasonTypes).toStrictEqual([InvalidReasonTypeEnum.MISSING_CLASSIFICATION_CODE, InvalidReasonTypeEnum.MISSING_CLASSIFICATION_NAME]);
  });

  it('should sort fetched data', () => {
    component.requestParams.fieldToSort = 'itemCode';
    component.requestParams.sortDirection = SortDirectionEnum.ASC;

    const mockEvent = {
      stopPropagation: jest.fn(),
    } as unknown as Event;

    component.onSort({field: 'itemCode', event: mockEvent});
    expect(component.requestParams.sortDirection).toBe(SortDirectionEnum.DESC);

    component.onSort({field: 'itemCode', event: mockEvent});
    expect(component.requestParams.fieldToSort).toBe('');
    expect(component.requestParams.sortDirection).toBe(SortDirectionEnum.None);
  });

  it('should reset filters and fetch data', () => {
    component.table = { clear: jest.fn(), clearFilterValues: jest.fn() } as unknown as Table;
    component.clearFilters();
    expect(component.globalSearchText).toBe('');

    const globalSearchSpy = jest.spyOn(component, 'globalSearch');
    component.globalSearchText = 'abc';
    component.selectedQuickFilter = {label: '', id: -1};
    component.clearGlobalSearchText();

    expect(component.globalSearchText).toBe('');
    expect(component.tableFilters.selectedStatus).toStrictEqual([]);
    expect(globalSearchSpy).toHaveBeenCalled();
  });

  it('should reset filters and apply quick filter', () => {
    jest.spyOn(component, 'onLazyLoad');
    const onLazyLoadSpy = jest.spyOn(component, 'onLazyLoad');
    component.table = { clearFilterValues: jest.fn(), filters: {retrievedOn: []} } as unknown as Table;

    component.selectQuickFilter({label: 'Valid', id: 3});

    expect(component.selectedQuickFilter).toStrictEqual({label: 'Valid', id: 3});
    expect(onLazyLoadSpy).toHaveBeenCalled();
  });

  it('should freeze a column when allowed', () => {
    const column = {
      field: 'itemCode',
      frozen: false,
      header: 'Item SKU',
      filterField: 'itemCode',
    };
    component.toggleFrozeOnColumn({col: column, newFrozenStatus: true});

    expect(component.frozenColumns).toContain(column);
    expect(component.noOfFrozenColumns).toBe(1);
  });

  it('should not freeze more than three columns', () => {
    component.noOfFrozenColumns = 3;
    component.frozenColumns = [
      {
        field: 'itemCode',
        frozen: false,
        header: 'Item SKU',
        filterField: 'itemCode',
      },
      {
        field: 'validationStatus',
        frozen: false,
        header: 'Classification Status',
        filterField: 'selectedStatus',
      },
      {
        field: 'comment',
        frozen: false,
        header: 'Comment',
        filterField: 'comment',
      },
    ];
    const column = {
      field: 'itemName',
      frozen: false,
      header: 'Item Name',
      filterField: 'itemName',
    };

    component.toggleFrozeOnColumn({col: column, newFrozenStatus: true});

    expect(column.frozen).toBeFalsy();
    expect(component.noOfFrozenColumns).toBe(3);
  });

  it('should enable edit mode and populate fields', () => {
    const mockRow = { id: 1, itemCode: '123', itemName: 'Test Item' } as any;
    component.enterEditMode(mockRow);

    expect(component.editMode).toBeTruthy();
    expect(component.backupEntry).toEqual(mockRow);
    expect(component.editedEntry).toEqual(mockRow);

    component.exitEditMode(0);
    expect(component.editMode).toBeFalsy();
  });

  it('should select all, unselect and select again', () => {
    jest
      .spyOn(mockProductMappingService, 'selectAll')
      .mockReturnValueOnce(of([1, 2]));
    component.tableData = [{
      id: 1,
    }, {
      id: 2,
    }];
    component.totalRecords = 2;

    const selectAllMock = jest.spyOn(mockProductMappingService, 'selectAll');

    component.onSelectAllChange({ checked: true } as TableSelectAllChangeEvent);
    expect(component.allSelected).toBeTruthy();
    expect(selectAllMock).toHaveBeenCalled();
    expect(component.selectedEntries).toEqual([{id: 1}, {id: 2}]);

    component.onRowUnselect({ data: {id: 2} } as TableRowSelectEvent);
    expect(component.allSelected).toBeFalsy();
    expect(component.selectedEntries).toEqual([{id: 1}]);

    component.selectedEntriesList = [{id: 1}, {id: 2}];
    component.onRowSelect({ data: {id: 2} } as TableRowSelectEvent);
    expect(component.allSelected).toBeTruthy();
    expect(component.selectedEntries).toEqual([{id: 1}, {id: 2}]);
  });

  it('should select all and unselect all', () => {
    jest
      .spyOn(mockProductMappingService, 'selectAll')
      .mockReturnValueOnce(of([1, 2]));
    component.tableData = [{id: 1} as IProduct, {id:2} as IProduct];
    component.totalRecords = 2;

    const selectAllMock = jest.spyOn(mockProductMappingService, 'selectAll');

    component.onSelectAllChange({ checked: true } as TableSelectAllChangeEvent);

    expect(component.allSelected).toBeTruthy();
    expect(selectAllMock).toHaveBeenCalled();
    expect(component.selectedEntries).toEqual([{id: 1}, {id: 2}]);

    const persistRowColorSpy = jest.spyOn(component, 'persistSelectedRows');
    component.onSelectAllChange({ checked: false } as TableSelectAllChangeEvent);

    expect(component.allSelected).toBeFalsy();
    expect(component.selectedEntries).toEqual([]);
    expect(persistRowColorSpy).toHaveBeenCalled();
  });

  it('should save changes and exit edit mode', () => {
    const mockResponse = {
      id: 1,
      itemCode: '123',
      itemName: 'Updated Item',
    } as any;
    jest
      .spyOn(mockProductMappingService, 'saveChanges')
      .mockReturnValue(of(mockResponse));

    component.saveChanges(0);

    expect(mockProductMappingService.saveChanges).toHaveBeenCalled();
    expect(component.editMode).toBeFalsy();
  });

  it('should restrict editable fields on dropdown change', () => {
    const mockRow = {
      id: 1,
      itemCode: '123',
      itemName: 'Test Item',
      proposedCategoryName: { code: '1', name: '1' },
      proposedGroupName: { code: '1', name: '1' },
      proposedSubgroupName: { code: '1', name: '1' },
    } as any;

    component.enterEditMode(mockRow);

    component.onProposedCategoryChange({
      value: { code: '1', name: '1' },
    } as DropdownChangeEvent);
    expect(component.editedEntry.proposedCategoryName).toStrictEqual({
      code: '1',
      name: '1',
    });
    expect(component.editedEntry.proposedGroupName).toStrictEqual({
      code: '',
      name: '',
    });
    expect(component.editedEntry.proposedSubgroupName).toStrictEqual({
      code: '',
      name: '',
    });

    component.onProposedGroupChange({
      value: { code: '1', name: '1' },
    } as DropdownChangeEvent);
    expect(component.editedEntry.proposedGroupName).toStrictEqual({
      code: '1',
      name: '1',
    });
    expect(component.editedEntry.proposedSubgroupName).toStrictEqual({
      code: '',
      name: '',
    });

    component.onProposedSubgroupChange({
      value: { code: '1', name: '1' },
    } as DropdownChangeEvent);
    expect(component.editedEntry.proposedSubgroupName).toStrictEqual({
      code: '1',
      name: '1',
    });
  });

  it('should populate groupOptions correctly', () => {
    component.categoryGroupSubgroupMapping = [
      {
        globalGroupName: { name: 'Group1', code: 'Group1' },
        globalCategoryName: { code: 'Cat1', name: 'Cat1' },
        globalSubgroupName: { code: 'Sub1', name: 'Sub1' },
      },
      {
        globalGroupName: { name: 'Group2', code: 'Group2' },
        globalCategoryName: { code: 'Cat1', name: 'Cat1' },
        globalSubgroupName: { code: 'Sub1', name: 'Sub1' },
      },
    ];
    component.editedEntry = {
      proposedCategoryName: { code: 'Cat1', name: 'Cat1' },
    } as any;

    component.getGroupOptions();

    expect(component.groupOptions).toEqual([
      { name: 'Group1', code: 'Group1' },
      { name: 'Group2', code: 'Group2' },
    ]);
  });

  it('should not duplicate groupOptions', () => {
    component.categoryGroupSubgroupMapping = [
      {
        globalGroupName: { name: 'Group1', code: 'Group1' },
        globalCategoryName: { code: 'Cat1', name: 'Cat1' },
        globalSubgroupName: { code: 'Sub1', name: 'Sub1' },
      },
      {
        globalGroupName: { name: 'Group2', code: 'Group2' },
        globalCategoryName: { code: 'Cat2', name: 'Cat2' },
        globalSubgroupName: { code: 'Sub1', name: 'Sub1' },
      },
    ];
    component.editedEntry = {
      proposedCategoryName: { code: 'Cat1', name: 'Cat1' },
    } as any;

    component.getGroupOptions();

    expect(component.groupOptions).toEqual([{ name: 'Group1', code: 'Group1' }]);
  });
});
