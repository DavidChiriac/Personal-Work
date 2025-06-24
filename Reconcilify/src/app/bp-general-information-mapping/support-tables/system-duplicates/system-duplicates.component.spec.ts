import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemDuplicatesComponent } from './system-duplicates.component';
import { SupportTablesService } from '../support-tables.service';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SortDirectionEnum } from '../../../shared/utils/sort-directions';

const mockRecord = {
  id: '224362s',
  origin: 'SAP GAMMA',
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
  language: 'S',
  taxNumber1: '',
  telephone1: '0',
  faxNumber: '',
  vatRegistrationNumber: '1234567',
  url: '',
  tradingPartner: 'trading_partner',
  category: 'Intercompany Payables',
  cfinCode: 9200005,
  vendor: true,
  customer: false,
  accountGroup: '0009',
  bpGrouping: 'BP05',
  oneTimeAcc: true,
  retrievedBy : ''
};

const mockSupportTablesService = {
  getSystemDuplicatesData: jest.fn().mockReturnValue(of({systemDuplicateDTOs: [mockRecord], filters: {numberOfRecords: 1}})),
  deleteSystemDuplicateRecord: jest.fn().mockReturnValue(of(true)),
  exportSystemDuplicatesData: jest.fn(),
  createSystemDuplicatesFilters: jest.fn(),
  getSystemDuplicatesFilters: jest.fn()
};

describe('SystemDuplicatesComponent', () => {
  let component: SystemDuplicatesComponent;
  let fixture: ComponentFixture<SystemDuplicatesComponent>;
  let supportTablesService: jest.Mocked<SupportTablesService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemDuplicatesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SupportTablesService, useValue: mockSupportTablesService },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemDuplicatesComponent);
    component = fixture.componentInstance;
    supportTablesService = TestBed.inject(
      SupportTablesService
    ) as jest.Mocked<SupportTablesService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should search with filters', () => {
    component.tableFilters = { selectedVendor: [{ value: 'vendor1' }] } as any;

    component.searchWithFilters();

    expect(supportTablesService.getSystemDuplicatesData).toHaveBeenCalledWith(
      expect.objectContaining({
        vendorCodes: ['vendor1'],
      })
    );
  });

  it('should handle delete record and refresh the table', () => {
    component.deletedRecord = '123';

    component.deleteRow();

    expect(
      supportTablesService.deleteSystemDuplicateRecord
    ).toHaveBeenCalledWith('123');
  });

  it('should export table data', () => {
    component.tableFilters = {
      selectedOrigin: [{ value: 'origin1' }],
      selectedVendor: [{ value: 'vendor1' }],
      selectedCustomer: null,
      retrievedOn: new Date('2024-01-01'),
    } as any;

    component.requestParams = {
      pageSize: 20,
      pageNumber: 0,
      globalSearchInput: '',
    };

    const mockResponse = new HttpResponse({
      body: new Blob(['sample data'], { type: 'octet/stream' }),
      headers: new HttpHeaders({
        'Content-Disposition': 'attachment; filename="export.csv"' // Properly set the content-disposition header
      })
    });
    
    supportTablesService.exportSystemDuplicatesData.mockReturnValue(of(mockResponse));

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const saveAsSpy = jest.spyOn(require('file-saver'), 'saveAs').mockReturnValue(of());

    component.exportTableData();

    expect(saveAsSpy).toHaveBeenCalledWith(expect.any(Blob), 'export.csv');
    expect(supportTablesService.exportSystemDuplicatesData).toHaveBeenCalledWith({
      ...component.requestParams,
      globalSearchInput: '',
      origins: ['origin1'],
      vendorCodes: ['vendor1'],
      customerCodes: undefined,
      categories: undefined,
      accountGroups: undefined,
      bpGroupings: undefined,
      oneTimeAccounts: undefined,
      retrievedOn: '2024-01-01',
    });

    expect(component.isExportInProgress).toBe(false);
  });

  it('should handle export error', () => {
    supportTablesService.exportSystemDuplicatesData.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.exportTableData();

    expect(component.isExportInProgress).toBe(false);
    expect(component.errorMessage).toBe(
      'There was an error while downloading the file'
    );
  });

  it('should handle clear filters', () => {
    component.clearFilters();

    expect(component.globalSearchText).toBe('');
  });

  it('should check if filters are empty', () => {
    component.globalSearchText = '';
    component.checkIfFiltersAreEmpty();

    expect(component.emptyFilters).toBe(true);
  });

  it('should clear global search', () => {
    component.ngOnInit();

    component.globalSearchText = '123';

    component.clearGlobalSearch();

    expect(component.globalSearchText).toBe('');
  });

  it('should get sort direction based on event', () => {
    const event = { sortField: 'name', sortOrder: 1 } as LazyLoadEvent;
    const result = component.getSortDirection(event);

    expect(result).toBe(SortDirectionEnum.ASC);
  });

  it('should return null sort direction if no sort field', () => {
    const event = { sortField: '' } as LazyLoadEvent;
    const result = component.getSortDirection(event);

    expect(result).toBeUndefined();
  });

  it('should delete a record', () => {
    component.ngOnInit();

    component.showDeleteDialog('1');

    expect(component.deletedRecord).toEqual('1');
    expect(component.deleteRecordVisible).toBeTruthy();


    const deleteDialogSpy = jest.spyOn(component, 'closeDeleteDialog');
    const searchSpy = jest.spyOn(component, 'searchWithFilters');

    component.deleteRow();

    expect(deleteDialogSpy).toHaveBeenCalled();
    expect(searchSpy).toHaveBeenCalled();

    component.closeDeleteDialog();

    expect(component.deleteRecordVisible).toBeFalsy();
  });

  it('should call getSystemDuplicatesData with correct params and handle success', () => {
    component.tableFilters = {
      selectedOrigin: [{ value: 'SAP GAMMA' }],
      selectedVendor: [{ value: 'No' }],
      selectedCustomer: [{ value: 'Yes' }],
      selectedOneTimeAcc: [{ value: 'No' }],
      selectedCategory: [{ value: 'Intercompany Payables' }],
      selectedAccountGroup: [{ value: '0009' }],
      selectedBpGrouping: [{ value: 'BP05' }],
      retrievedOn: new Date('2024-01-01'),
    } as any;

    component.requestParams = {
      pageSize: 20,
      pageNumber: 0,
      globalSearchInput: '',
    };

    supportTablesService.getSystemDuplicatesData.mockReturnValue(of({filters: {numberOfRecords: 1}, systemDuplicateDTOs: [mockRecord]}));

    component.searchWithFilters();

    expect(component.loading).toBe(false);
    expect(supportTablesService.getSystemDuplicatesData).toHaveBeenCalledWith({
      ...component.requestParams,
      globalSearchInput: '',
      origins: ['SAP GAMMA'],
      vendorCodes: ['No'],
      customerCodes: ['Yes'],
      categories: ['Intercompany Payables'],
      accountGroups: ['0009'],
      bpGroupings: ['BP05'],
      oneTimeAccounts: ['No'],
      retrievedOn: '2024-01-01',
    });

    expect(component.tableData).toEqual([mockRecord]);
    expect(component.totalRecords).toBe(1);
  });
});
