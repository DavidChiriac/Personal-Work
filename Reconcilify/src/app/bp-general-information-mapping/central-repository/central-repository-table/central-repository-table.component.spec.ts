/* eslint-disable max-lines */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CentralRepositoryTableComponent } from './central-repository-table.component';
import { Table, TableSelectAllChangeEvent } from 'primeng/table';
import { MockService } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { CentralRepositoryService } from '../central-repository.service';
import { LazyLoadEvent } from 'primeng/api';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import fileSaver from 'file-saver';
import { DecimalPipe } from '@angular/common';
import { IVendorCustomerRequestParams } from './models/central-repository-table.interface';
import { SessionStorageService } from 'ngx-webstorage';
import { CentralRepositoryFilters } from './models/central-repository-table-filters';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableFiltersUtils } from '../../../shared/utils/table-filters-utils';
import { TestingModule } from '../../../shared/testing.module';
import { vendorCustomerStatus } from '../../../shared/constants/vendor-customer-status.constant';
import { SortDirectionEnum } from '../../../shared/utils/sort-directions';

describe('CentralRepositoryTableComponent', () => {
  let router: Router;
  const route: any = {};
  let component: CentralRepositoryTableComponent;
  let fixture: ComponentFixture<CentralRepositoryTableComponent>;

  const tableDataMock = [
    {
      id: '1',
      origin: 'SAP GAMMA',
      matching: 'UNIQUE',
      retrievedOn: '2024-03-18',
      vendorCustomerCode: 'EMX006815',
      country: 'MX',
      name1: 'LUIS GUSTAVO HERNANDEZ BASTIDA',
      name2: 'Chiriac',
      city: 'PEÑON DE LOS BAÑOS',
      district: '',
      poBox: '',
      postalCode: '15520',
      region: 'DF',
      searchTerm: '',
      street: '-',
      title: 'title',
      group: 'LIVI',
      language: 'S',
      taxNumber1: '',
      telephone1: '0',
      faxNumber: '',
      vatRegistrationNumber: '1234567',
      url: '',
      tradingPartner: 'trading_partner',
      category: 'Intercompany Payables',
      cfinCode: 1,
      vendor: true,
      customer: false,
      bpGrouping: 'BP05',
      accountGroup: '0009',
      firstLetter: 'E',
      comment: '',
      status: 'New',
      exportedBy: '0',
      exportedOn: '2024-03-18',
      updatedBy: '1',
      updatedOn: '2024-03-18',
      oneTimeAcc: false,
      isStreetDuplicate: '',
      isNameDuplicate: '',
      isVatNumberDuplicate: '',
      vatTaxComparable: '',
      name1Trans: '',
      exported: false,
      combinedKeyDuplicate: '',
      isExported: false
    },
  ];
  const selectedRowMock = [{id: '1v', status: '', cfinCode: 1}, {id: '2v', status: '', cfinCode: 1}];
  const mockExportResponse = new HttpResponse({
    body: new Blob(['mock data'], { type: 'octet/stream' }),
    headers: new HttpHeaders().set(
      'content-disposition',
      'attachment; filename="mockfile.txt"'
    ),
  });

  const routerMock = {
    navigate: jest.fn()
  };

  const mockSessionStorageService: SessionStorageService = MockService(
    SessionStorageService,
    {
      retrieve: jest.fn().mockReturnValue(false),
    }
  );

  const centralRepositoryServiceMock: CentralRepositoryService = MockService(
    CentralRepositoryService,
    {
      getVendorCustomerData: jest.fn().mockReturnValue(
        of({
          centralData: tableDataMock,
          filters: { numberOfRecords: 10 },
        })
      ),
      selectAllVendorsCustomerRows: jest
        .fn()
        .mockReturnValue(of(selectedRowMock)),
      deleteRecord: jest.fn().mockReturnValue(of(null)),
      exportVendorsCustomerData: jest.fn().mockReturnValue(of([])),
      exportCfinData: jest.fn().mockReturnValue(of(mockExportResponse)),
      getVendorCustomerDataFilters: jest.fn().mockReturnValue(of({})),
      createFilters: jest
        .fn()
        .mockImplementation((filters: CentralRepositoryFilters) => {
          const newFilters: CentralRepositoryFilters =
            new CentralRepositoryFilters();

          newFilters.status = TableFiltersUtils.convertToMultiselectOption(
            filters['statuses']
          );
          newFilters.matching = TableFiltersUtils.convertToMultiselectOption(
            filters['matchings']
          );
          newFilters.origin = TableFiltersUtils.convertToMultiselectOption(
            filters['origins']
          );
          newFilters.vendor = TableFiltersUtils.convertToMultiselectOption(
            filters['vendorCodes']
          );
          newFilters.customer = TableFiltersUtils.convertToMultiselectOption(
            filters['customerCodes']
          );
          newFilters.oneTimeAcc = TableFiltersUtils.convertToMultiselectOption(
            filters['oneTimeAccounts']
          );
          newFilters.category = TableFiltersUtils.convertToMultiselectOption(
            filters['categories']
          );
          newFilters.bpGrouping = TableFiltersUtils.convertToMultiselectOption(
            filters['bpGroupings']
          );
          newFilters.accountGroup =
            TableFiltersUtils.convertToMultiselectOption(
              filters['accountGroups']
            );
          return newFilters;
        }),
      massApprove: jest.fn().mockReturnValue(of(null)),
      massDelete: jest.fn().mockReturnValue(of(null))
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CentralRepositoryTableComponent, Table],
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: CentralRepositoryService,
          useValue: centralRepositoryServiceMock,
        },
        {
          provide: SessionStorageService,
          useValue: mockSessionStorageService,
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: ActivatedRoute,
          useValue: route
        },
        DecimalPipe,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CentralRepositoryTableComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    TestBed.inject(DecimalPipe);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onLazyLoad if queryParams are empty', () => {
    // Arrange
    jest.spyOn(component, 'getTableFilters');

    // Act
    component.ngOnInit();

    // Assert
    expect(component.getTableFilters).toHaveBeenCalledWith(true);
  });

  it('should set default search by status new and approved', () => {
    // Arrange
    component.tableFilters.status = [{ value: 'New' }, { value: 'Approved' }];
    component.tableFilters.selectedStatus = [];
    jest.spyOn(component, 'onLazyLoad');

    // Act
    component.defaultSearch();

    // Assert
    expect(component.requestParams.statuses).toEqual([
      component.vendorCustomerStatus.new,
      component.vendorCustomerStatus.approved,
    ]);
    expect(component.tableFilters.selectedStatus).toEqual([
      { value: component.vendorCustomerStatus.new },
      { value: component.vendorCustomerStatus.approved },
    ]);
    expect(component.onLazyLoad).toHaveBeenCalled();
  });

  it('should set up requestParams and update tableFilters correctly', () => {
    // Arrange
    const params = {
      status: 'Mapped',
      origin: 'Sap Corp',
    };
    const spyOnGetTableData = jest.spyOn(component, 'getTableData');
    const expectedRequestParams = {
      pageSize: 20,
      pageNumber: 0,
      fieldToSort: null,
      sortDirection: null,
      globalSearchInput: component.globalSearchText,
      statuses: ['Mapped'],
      origins: ['Sap Corp'],
    };

    // Act
    component.searchWithPrefilledParams(params);

    // Assert
    expect(component.requestParams).toEqual(expectedRequestParams);
    expect(spyOnGetTableData).toHaveBeenCalled();
    expect(component.tableFilters.selectedStatus).toEqual([
      { value: 'Mapped' },
    ]);
    expect(component.tableFilters.selectedOrigin).toEqual([
      { value: 'Sap Corp' },
    ]);
  });

  it('should select all rows when event.checked is true', () => {
    // Arrange
    const event = { checked: true };
    component.selectedRowsList = [];

    // Act
    component.onSelectAllChange(event as TableSelectAllChangeEvent);

    // Assert
    expect(component.selectedRowsList).toEqual(selectedRowMock);
    expect(
      centralRepositoryServiceMock.selectAllVendorsCustomerRows
    ).toHaveBeenCalledWith(component.requestParams);
  });

  it('should clear selected rows when event.checked is false', () => {
    // Arrange
    component.selectedRowsList = [{id: '1', status: '', cfinCode: 1, category: '', bpGrouping: '', accountGroup: ''}, {id: '2', status: '', cfinCode: 1, category: '', bpGrouping: '', accountGroup: ''}];
    const event = { checked: false };
    const spyOnPersistSelectedRows = jest.spyOn(
      component,
      'persistSelectedRows'
    );
    // Act
    component.onSelectAllChange(event as TableSelectAllChangeEvent);

    // Assert
    expect(component.selectedRowsList).toEqual([]);
    expect(spyOnPersistSelectedRows).toHaveBeenCalled();
  });

  it('should clear all filters and reset properties', () => {
    // Arrange
    component.selectedRowsList = [{id: '1', status: '', cfinCode: 1, category: '', bpGrouping: '', accountGroup: ''}, {id: '2', status: '', cfinCode: 1, category: '', bpGrouping: '', accountGroup: ''}];
    component.globalSearchText = 'example text';
    component.allSelected = true;
    component.tableFilters = { reset: jest.fn() } as any;
    component.tableRef = { reset: jest.fn() } as any;

    const tableFiltersReset = jest.spyOn(component.tableFilters, 'reset');
    const tableRefReset = jest.spyOn(component.tableRef, 'reset');

    // Act
    component.clearFilters();

    // Assert
    expect(component.selectedRowsList).toEqual([]);
    expect(component.globalSearchText).toEqual('');
    expect(component.allSelected).toEqual(false);
    expect(tableFiltersReset).toHaveBeenCalled();
    expect(tableRefReset).toHaveBeenCalled();
  });

  it('should clear global search text and call getTableData', () => {
    // Arrange
    component.globalSearchText = 'example text';
    component.requestParams = {
      globalSearchInput: 'example text',
      pageSize: 20,
    } as IVendorCustomerRequestParams;

    // Act
    component.clearGlobalSearch();

    // Assert
    expect(component.globalSearchText).toEqual('');
    expect(component.requestParams.globalSearchInput).toEqual('');
  });

  it('should call closeDeleteDialog and getTableData on successful delete', () => {
    // Arrange
    const mockDeletedRecordId = '2';
    const spyOnCloseDeleteDialog = jest.spyOn(component, 'closeDeleteDialog');
    const spyOnGetTableData = jest.spyOn(component, 'getTableData');
    component.deletedRecord = mockDeletedRecordId;

    // Act
    component.deleteRow();

    // Assert
    expect(spyOnCloseDeleteDialog).toHaveBeenCalled();
    expect(centralRepositoryServiceMock.deleteRecord).toHaveBeenCalledWith(
      mockDeletedRecordId
    );
    expect(spyOnGetTableData).toHaveBeenCalled();
  });

  it('should add record to selectedRowsList and call all the checks inside the method', () => {
    // Arrange
    const event = { data: { id: 1, status: 'New', cfinCode: 1, category: 'Non Trade Payables', bpGrouping: 'BP02', accountGroup: '0005' } };
    const spyOnCheckSelectAll = jest.spyOn(component, 'checkSelectAll');
    const spyOnChangeRowColor = jest.spyOn(component, 'changeRowColor');
    const spyValidateCfinOfSelectedRecord = jest.spyOn(component, 'validateCfinOfSelectedRecords');
    const spyCheckIfFiltersAreEmpty = jest.spyOn(component, 'checkIfFiltersAreEmpty');

    // Act
    component.onRowSelect(event);

    // Assert
    expect(component.selectedRowsList).toEqual([event.data]);

    expect(spyOnCheckSelectAll).toHaveBeenCalled();
    expect(spyValidateCfinOfSelectedRecord).toHaveBeenCalled();
    expect(spyCheckIfFiltersAreEmpty).toHaveBeenCalled();
    expect(spyOnChangeRowColor).toHaveBeenCalledWith(1, true);

    component.onRowSelect({data: {...event.data, cfinCode: 2, id: 2}});

    expect(component.selectedRowsList).toEqual([event.data, {...event.data, cfinCode: 2, id: 2}]);
    expect(component.canMassApprove).toBeTruthy();
    expect(component.canMassDelete).toBeTruthy();
  });

  it('should remove record from selectedRowsList', () => {
    // Arrange
    const spyOnChangeRowColor = jest.spyOn(component, 'changeRowColor');
    component.selectedRows = [tableDataMock[0], {...tableDataMock[0], cfinCode: 2, id: '2'}];
    component.selectedRowsList = [{
      id: '1',
      status: 'New',
      cfinCode: 1,
      category: 'Intercompany Payables',
      bpGrouping: 'BP05',
      accountGroup: '0009'
    }, {
      id: '2',
      status: 'New',
      cfinCode: 2,
      category: 'Intercompany Payables',
      bpGrouping: 'BP05',
      accountGroup: '0009'
    }];
    // Act
    component.onRowUnselect({data: tableDataMock[0]});

    // Assert
    expect(component.selectedRowsList).toEqual([{
      id: '2',
      status: 'New',
      cfinCode: 2,
      category: 'Intercompany Payables',
      bpGrouping: 'BP05',
      accountGroup: '0009'
    },
    {
      id: '1',
      status: 'New',
      cfinCode: 1,
      category: 'Intercompany Payables',
      bpGrouping: 'BP05',
      accountGroup: '0009'
    }]);

    component.selectedRows = [];

    component.onRowUnselect({data: tableDataMock[0]});

    expect(component.selectedRowsList).toEqual([{
      id: '2',
      status: 'New',
      cfinCode: 2,
      category: 'Intercompany Payables',
      bpGrouping: 'BP05',
      accountGroup: '0009'
    }]);

    expect(spyOnChangeRowColor).toHaveBeenCalledWith(tableDataMock[0].id, false);
  });

  it('should update _selected property of row with the given ID', () => {
    // Arrange
    component.tableData = [
      { id: '1', _selected: false },
      { id: '2', _selected: false },
    ] as any;

    // Act
    component.changeRowColor('2', true);

    // Assert
    expect(component.tableData[0]._selected).toBe(false);
    expect(component.tableData[1]._selected).toBe(true);
  });

  it('should set deletedRecord and deleteRecordVisible', () => {
    // Arrange
    const id = '1';

    // Act
    component.showDeleteDialog(id);

    // Assert
    expect(component.deletedRecord).toEqual(id);
    expect(component.deleteRecordVisible).toBe(true);
  });

  it('should update tableFilters with the provided filters', () => {
    // Arrange
    const filters = {
      statuses: ['New', 'Mapped'],
      matchings: [],
      origins: ['Sap Corp', 'Sap Gamma'],
      vendorCodes: [true, false],
      customerCodes: [false],
      categories: ['Category 1', 'Category 2'],
      bpGroupings: ['Group 1', 'Group 2'],
      accountGroups: ['Group A', 'Group B'],
    } as any;

    // Act
    component.tableFilters = centralRepositoryServiceMock.createFilters(filters);

    // Assert
    expect(component.tableFilters.status).toEqual([
      { value: 'New' },
      { value: 'Mapped' },
    ]);

    expect(component.tableFilters.origin).toEqual([
      { value: 'Sap Corp' },
      { value: 'Sap Gamma' },
    ]);

    expect(component.tableFilters['vendor']).toEqual([
      { value: true },
      { value: false },
    ]);
    expect(component.tableFilters['customer']).toEqual([{ value: false }]);

    expect(component.tableFilters.category).toEqual([
      { value: 'Category 1' },
      { value: 'Category 2' },
    ]);

    expect(component.tableFilters.bpGrouping).toEqual([
      { value: 'Group 1' },
      { value: 'Group 2' },
    ]);

    expect(component.tableFilters.accountGroup).toEqual([
      { value: 'Group A' },
      { value: 'Group B' },
    ]);
  });

  it('should prepare filters params with selected values mapped to strings', () => {
    // Arrange
    component.tableFilters = {
      refineFiltersDataForRequestBody: jest.fn(),
      selectedStatus: [{ value: 'New' }],
      selectedMatching: [{ value: 'Matched' }],
      selectedOrigin: [{ value: 'Sap Corp' }],
      selectedVendor: [{ value: true }],
      selectedCustomer: [{ value: false }],
      selectedCategory: [{ value: 'Category 1' }],
      selectedBpGrouping: [{ value: 'Group 1' }],
      selectedAccountGroup: [{ value: 'Group A' }],
    } as any;

    const expectedFilters = {
      statuses: ['New'],
      matchings: ['Matched'],
      origins: ['Sap Corp'],
      vendorCodes: [true],
      customerCodes: [false],
      categories: ['Category 1'],
      bpGroupings: ['Group 1'],
      accountGroups: ['Group A'],
    };

    // Act
    const filters = component.prepareFiltersParams();

    // Assert
    expect(filters.statuses).toEqual(expectedFilters.statuses);
    expect(filters.matchings).toEqual(expectedFilters.matchings);
    expect(filters.origins).toEqual(expectedFilters.origins);
    expect(filters.vendorCodes).toEqual(expectedFilters.vendorCodes);
    expect(filters.customerCodes).toEqual(expectedFilters.customerCodes);
    expect(filters.categories).toEqual(expectedFilters.categories);
    expect(filters.bpGroupings).toEqual(expectedFilters.bpGroupings);
    expect(filters.accountGroups).toEqual(expectedFilters.accountGroups);
  });

  it('should prepare filters params with selected values from previous search', () => {
    // Arrange
    component.tableFilters = {
      refineFiltersDataForRequestBody: jest.fn(),
      selectedStatus: [{ value: 'New' }],
      selectedMatching: [{ value: 'Matched' }],
      selectedOrigin: [{ value: 'Sap Corp' }],
      selectedVendor: [{ value: true }],
      selectedCustomer: [{ value: false }],
      selectedCategory: [{ value: 'Category 1' }],
      selectedBpGrouping: [{ value: 'Group 1' }],
      selectedAccountGroup: [{ value: 'Group A' }],
    } as any;

    const expectedFilters = {
      statuses: ['New'],
      matchings: ['Matched'],
      origins: ['Sap Corp'],
      vendorCodes: ['true'],
      customerCodes: ['false'],
      categories: ['Category 1'],
      bpGroupings: ['Group 1'],
      accountGroups: ['Group A'],
    };

    jest.spyOn(mockSessionStorageService, 'retrieve').mockReturnValue({
      statuses: ['New'],
      matchings: ['Matched'],
      origins: ['Sap Corp'],
      vendorCodes: [true],
      customerCodes: [false],
      categories: ['Category 1'],
      bpGroupings: ['Group 1'],
      accountGroups: ['Group A'],
    });

    // Act
    const filters = component.prepareFiltersParams();

    // Assert
    expect(component.tableFilters.selectedStatus).toEqual(
      expectedFilters.statuses?.map((item) => {
        return { value: item };
      })
    );
    expect(component.tableFilters.selectedMatching).toEqual(
      expectedFilters.matchings?.map((item) => {
        return { value: item };
      })
    );
    expect(component.tableFilters.selectedOrigin).toEqual(
      expectedFilters.origins?.map((item) => {
        return { value: item };
      })
    );
    expect(component.tableFilters.selectedVendor).toEqual(
      expectedFilters.vendorCodes?.map((item) => {
        return { value: item };
      })
    );
    expect(component.tableFilters.selectedCustomer).toEqual(
      expectedFilters.customerCodes?.map((item) => {
        return { value: item };
      })
    );
    expect(component.tableFilters.selectedCategory).toEqual(
      expectedFilters.categories?.map((item) => {
        return { value: item };
      })
    );
    expect(component.tableFilters.selectedBpGrouping).toEqual(
      expectedFilters.bpGroupings?.map((item) => {
        return { value: item };
      })
    );
    expect(component.tableFilters.selectedAccountGroup).toEqual(
      expectedFilters.accountGroups?.map((item) => {
        return { value: item };
      })
    );

    expect(filters).toBeTruthy();
  });

  it('should set default pagination parameters when event is undefined', () => {
    // Act
    component.setupPagination(undefined);

    // Assert
    expect(component.requestParams.pageSize).toBe(20);
    expect(component.requestParams.pageNumber).toBe(0);
    expect(component.requestParams.fieldToSort).toBe(null);
    expect(component.requestParams.sortDirection).toBe(null);
  });

  it('should set pagination parameters based on event', () => {
    // Arrange
    const event: LazyLoadEvent = {
      first: 0,
      rows: 10,
      sortField: 'origin',
      sortOrder: 1,
    };

    // Act
    component.setupPagination(event);

    // Assert
    expect(component.requestParams.pageSize).toBe(10);
    expect(component.requestParams.fieldToSort).toBe('origin');
    expect(component.requestParams.sortDirection).toBe(SortDirectionEnum.ASC);
  });

  it('should fetch table data and filters and update state correctly', () => {
    // Arrange
    const mockedData = {
      centralData: tableDataMock,
      filters: { numberOfRecords: 10 },
    };

    // Act
    component.getTableData();

    // Assert
    expect(component.loading).toBe(false);
    expect(
      centralRepositoryServiceMock.getVendorCustomerData
    ).toHaveBeenCalledWith(component.requestParams);
    expect(component.totalRecords).toBe(mockedData.filters.numberOfRecords);
    expect(component.tableData).toEqual(mockedData.centralData);
  });

  it('should export table data', () => {
    // Act
    component.exportTableData();

    // Assert
    expect(
      centralRepositoryServiceMock.exportVendorsCustomerData
    ).toHaveBeenCalled();
  });

  it('should validate the export', () => {
    component.selectedRowsList = [{status: 'New', id: '1', cfinCode: 123, category: '', bpGrouping: '', accountGroup: ''}];
    component.checkIfCanExportForCfin();
    expect(component.canExportForCfin).toBeFalsy();

    component.selectedRowsList = [{status: 'Approved', id: '1', cfinCode: 123, category: '', bpGrouping: '', accountGroup: ''}];
    component.checkIfCanExportForCfin();
    expect(component.canExportForCfin).toBeTruthy();
  });

  it('should handle error on export table data', () => {
    // Arrange
    const errorResponse = new Error('An error occurred');
    jest
      .spyOn(centralRepositoryServiceMock, 'exportVendorsCustomerData')
      .mockReturnValue(throwError(() => errorResponse));

    // Act
    component.exportTableData();

    // Assert
    expect(component.isExportInProgress).toBe(false);
    expect(component.errorModalVisible).toBe(true);
  });

  it('should export CFIN data', () => {
    // Arrange
    const spyOnSaveAs = jest.spyOn(fileSaver, 'saveAs');
    jest.spyOn(component, 'getTableData');
    jest.spyOn(component, 'getTableFilters');

    // Act
    component.exportCfin();

    // Assert
    expect(component.getTableData).toHaveBeenCalled();
    expect(component.getTableFilters).toHaveBeenCalled();
    expect(spyOnSaveAs).toHaveBeenCalled();
    expect(component.isExportCfinInProgress).toBe(false);
  });

  it('should handle error on export CFIN data', () => {
    // Arrange
    const errorResponse = new Error('An error occurred');
    jest
      .spyOn(centralRepositoryServiceMock, 'exportCfinData')
      .mockReturnValue(throwError(() => errorResponse));

    // Act
    component.exportCfin();

    // Assert
    expect(component.isExportInProgress).toBe(false);
    expect(component.errorModalVisible).toBe(true);
  });

  it('should toggle error modal visibility', () => {
    // Arrange
    component.errorModalVisible = false;

    // Act
    component.toggleErrorModal();

    // Assert
    expect(component.errorModalVisible).toBe(true);
  });

  it('should reset pagination when goToFirstPage is true', () => {
    // Arrange
    jest.spyOn(component, 'resetPagination');
    jest.spyOn(component, 'setupPagination');

    // Act
    component.getRequestParams(undefined, true);

    // Assert
    expect(component.resetPagination).toHaveBeenCalled();
    expect(component.setupPagination).not.toHaveBeenCalled();
  });

  it('should setup pagination when event is provided', () => {
    // Arrange
    jest.spyOn(component, 'resetPagination');
    jest.spyOn(component, 'setupPagination');
    const mockEvent: LazyLoadEvent = {
      first: 0,
      rows: 10,
    };

    // Act
    component.getRequestParams(mockEvent);

    // Assert
    expect(component.setupPagination).toHaveBeenCalledWith(mockEvent);
    expect(component.resetPagination).not.toHaveBeenCalled();
  });

  it('should reset pagination when neither event nor goToFirstPage is true', () => {
    // Arrange
    jest.spyOn(component, 'resetPagination');
    jest.spyOn(component, 'setupPagination');

    // Act
    component.getRequestParams();

    // Assert
    expect(component.resetPagination).toHaveBeenCalled();
    expect(component.setupPagination).not.toHaveBeenCalled();
  });

  it('should set toggleStatus and call searchByStatus with "new" status', () => {
    // Arrange
    jest.spyOn(component, 'searchByStatus');

    // Act
    component.showByStatus(vendorCustomerStatus.new, false);

    // Assert
    expect(component.toggleStatus.newWithoutCfin.selected).toBe(true);
    expect(component.toggleStatus.newWithCfin.selected).toBe(false);
    expect(component.toggleStatus.mapped.selected).toBe(false);
    expect(component.toggleStatus.approved.selected).toBe(false);
    expect(component.searchByStatus).toHaveBeenCalledWith(
      vendorCustomerStatus.new
    );
  });

  it('should set toggleStatus and call searchByStatus with "mapped" status', () => {
    // Arrange
    jest.spyOn(component, 'searchByStatus');

    // Act
    component.showByStatus(vendorCustomerStatus.mapped);

    // Assert
    expect(component.toggleStatus.newWithoutCfin.selected).toBe(false);
    expect(component.toggleStatus.newWithCfin.selected).toBe(false);
    expect(component.toggleStatus.mapped.selected).toBe(true);
    expect(component.toggleStatus.approved.selected).toBe(false);
    expect(component.searchByStatus).toHaveBeenCalledWith(
      vendorCustomerStatus.mapped
    );
  });

  it('should set toggleStatus and call searchByStatus with "approved" status', () => {
    // Arrange
    jest.spyOn(component, 'searchByStatus');

    // Act
    component.showByStatus(vendorCustomerStatus.approved);

    // Assert
    expect(component.toggleStatus.newWithoutCfin.selected).toBe(false);
    expect(component.toggleStatus.newWithCfin.selected).toBe(false);
    expect(component.toggleStatus.mapped.selected).toBe(false);
    expect(component.toggleStatus.approved.selected).toBe(true);
    expect(component.searchByStatus).toHaveBeenCalledWith(
      vendorCustomerStatus.approved
    );
  });

  it('should reset toggleStatus and call getTableData for unknown status', () => {
    // Arrange
    const status = 'unknown';
    jest.spyOn(component, 'getTableData');

    // Act
    component.showByStatus(status);

    // Assert
    expect(component.toggleStatus.newWithoutCfin.selected).toBe(false);
    expect(component.toggleStatus.newWithCfin.selected).toBe(false);
    expect(component.toggleStatus.mapped.selected).toBe(false);
    expect(component.toggleStatus.approved.selected).toBe(false);
    expect(component.getTableData).toHaveBeenCalled();
  });

  it('should set requestParams and tableFilters, and call getTableData', () => {
    // Arrange
    jest.spyOn(component, 'getTableData');

    // Act
    component.searchByStatus(vendorCustomerStatus.new);

    // Assert
    expect(component.requestParams).toEqual({
      pageSize: 20,
      pageNumber: 0,
      fieldToSort: null,
      sortDirection: null,
      globalSearchInput: component.globalSearchText,
      statuses: [vendorCustomerStatus.new],
    });
    expect(component.tableFilters.selectedStatus).toEqual([
      { value: vendorCustomerStatus.new },
    ]);
    expect(component.getTableData).toHaveBeenCalled();
  });

  it('should set status badges correctly', () => {
    // Arrange
    const data = {
      statusCountDTO: {
        newWithoutCfinCount: 10,
        newWithCfinCount: 10,
        mappedCount: 20,
        approvedCount: 30,
      },
    };

    // Act
    component.setStatusBadge(data);

    // Assert
    expect(component.toggleStatus.newWithoutCfin.badge).toEqual('10');
    expect(component.toggleStatus.mapped.badge).toEqual('20');
    expect(component.toggleStatus.approved.badge).toEqual('30');
  });

  it('should set status badges correctly', () => {
    component.openMassApproveModal();
    expect(component.approveModalVisible).toBeTruthy();

    component.closeApproveModal();
    expect(component.approveModalVisible).toBeFalsy();
    expect(component.approveComment).toEqual('');

    component.approveComment='hello';
    component.massApprove();
    expect(component.loading).toBeFalsy();
  });

  it('should not allow mass approve when any selected record has an invalid cfin code', () => {
    component.isAnyCfinInvalid = true;
    component.massApprove();

    expect(component.errorMessage).toBeTruthy();
    expect(component.errorModalVisible).toBeTruthy();
  });

  it('should not allow mass delete when any selected record has a status different than New', () => {
    component.selectedRowsList = [
      { category: 'Intercompany Payables', cfinCode: 199123, id: '', status: vendorCustomerStatus.mapped, bpGrouping: '', accountGroup: '' },
    ];    
    component.checkSelectedList();

    expect(component.canMassDelete).toBeFalsy();

    component.selectedRowsList[0].status = vendorCustomerStatus.new;

    component.checkIfCanMassDelete();

    expect(component.canMassDelete).toBeTruthy();
  });

  it('should mass Delete successfully', () => {
    const tableFiltersSpy = jest.spyOn(component, 'getTableFilters');
    const tableDataSpy = jest.spyOn(component, 'getTableData');

    component.selectedRowsList = [
      { category: 'Intercompany Payables', cfinCode: 199123, id: '1', status: vendorCustomerStatus.new, bpGrouping: '', accountGroup: '' },
      { category: 'Intercompany Payables', cfinCode: 199123, id: '2', status: vendorCustomerStatus.new, bpGrouping: '', accountGroup: '' },
      { category: 'Intercompany Payables', cfinCode: 199123, id: '3', status: vendorCustomerStatus.new, bpGrouping: '', accountGroup: '' },
    ];

    component.openMassDeleteModal();
    expect(component.massDeleteModalVisible).toBeTruthy();

    component.massDelete();

    expect(component.loading).toBeFalsy();
    expect(component.isDeleting).toBeFalsy();
    expect(component.massDeleteModalVisible).toBeFalsy();
    expect(tableFiltersSpy).toHaveBeenCalled();
    expect(tableDataSpy).toHaveBeenCalled();

    jest.spyOn(centralRepositoryServiceMock, 'massDelete').mockReturnValueOnce(throwError(() => {new Error('An error occured');}));

    component.massDelete();

    expect(component.loading).toBeFalsy();
    expect(component.isDeleting).toBeFalsy();
    expect(component.massDeleteModalVisible).toBeFalsy();
    expect(component.errorMessage).toBe('There was an error while deleting the records');
    expect(component.errorModalVisible).toBeTruthy();
  });

  it('should reset tabs on status change', () => {
    component.onMultiselectSelectionChange([{origin: 'approved'}], 'selectedStatus');
    expect(component.toggleStatus.mapped.selected).toBeFalsy();
  });

  it('should store the data in session storage when editing', () => {
    jest.spyOn(mockSessionStorageService, 'store');

    component.editRow(12, 1);

    expect(mockSessionStorageService.store).toHaveBeenCalledTimes(4);

  });

  it('should store filters and navigate to the edit route when editRow is called', () => {
    const row = 5;  // Example row value
    const prepareFiltersParamsSpy = jest.spyOn(component, 'prepareFiltersParams').mockReturnValue({
      vendorCustomerCode: '',
      cfinCode: '',
      name1: '',
      name2: '',
      searchTerm: '',
      country: '',
      city: '',
      district: '',
      poBox: '',
      postalCode: '',
      region: '',
      street: '',
      title: '',
      group: '',
      language: '',
      taxNumber1: '',
      telephone1: '',
      faxNumber: '',
      vatRegistrationNumber: '',
      url: '',
      tradingPartner: '',
      vatTaxComparable: '',
      comment: '',
      retrievedOn: '',
      exportedBy: '',
      exportedOn: '',
      updatedBy: '',
      updatedOn: '',
      statuses: [],
      matchings: [],
      origins: [],
      vendorCodes: [],
      customerCodes: [],
      oneTimeAccounts: [],
      categories: [],
      bpGroupings: [],
      accountGroups: []
    });

    const sessionStorageServiceSpy = jest.spyOn(mockSessionStorageService, 'store');

    component.requestParams = { pageSize: 20, pageNumber: 0, sortDirection: SortDirectionEnum.ASC, fieldToSort: 'status', globalSearchInput: '' };  // Mock requestParams

    component.editRow(row, 1);

    expect(sessionStorageServiceSpy).toHaveBeenCalledWith('filters', { ...component.prepareFiltersParams(), ...component.requestParams });
    expect(sessionStorageServiceSpy).toHaveBeenCalledWith('recordViewClosed', false);
    expect(router.navigate).toHaveBeenCalledWith(['edit', row], { relativeTo: route });
    expect(prepareFiltersParamsSpy).toHaveBeenCalled();
  });

  it('should set isAnyCfinInvalid to true if any record has invalid cfinCode', () => {
    component.selectedRowsList = [
      { category: 'Intercompany Payables', cfinCode: 199123, id: '', status: vendorCustomerStatus.new, bpGrouping: '', accountGroup: '' },
    ];

    component.validateCfinOfSelectedRecords();

    expect(component.isAnyCfinInvalid).toBe(true);
  });
});
