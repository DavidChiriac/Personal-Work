import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicatesTableComponent } from './duplicates-table.component';
import { TestingModule } from '../../../../shared/testing.module';
import { Table } from 'primeng/table';
import { CentralRepositoryService } from '../../central-repository.service';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { Dropdown } from 'primeng/dropdown';
import { CentralRepositoryFilters } from '../../central-repository-table/models/central-repository-table-filters';
import { EventEmitter } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

const mockRecord = {
  id: '224362s',
  origin: 'SAP GAMMA',
  matching: null,
  retrievedOn: '2024-03-18T12:48:11.990Z',
  vendorCustomerCode: 'EMX006815',
  country: 'MX',
  name1: 'LUIS GUSTAVO HERNANDEZ BASTIDA',
  name2: 'Chiriac',
  city: 'PEÑON DE LOS BAÑOS',
  district: null,
  poBox: null,
  postalCode: '15520',
  region: 'DF',
  searchTerm: null,
  street: '-',
  title: 'title',
  group: 'LIVI',
  language: 'S',
  vatTaxComparable: '',
  isVatTaxDuplicate: 'UNIQUE',
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
  bpGrouping: 'BP05',
  accountGroup: '0009',
  firstLetter: 'E',
  comment: '',
  status: 'new',
  exportedBy: '0',
  exportedOn: '2024-03-18T12:48:11.990Z',
  updatedBy: '1',
  updatedOn: '2024-03-18T12:48:11.990Z',
  oneTimeAcc: null,
  isStreetDuplicate: null,
  isNameDuplicate: null,
  isVatNumberDuplicate: null,
  name1Trans: null,
  exported: false,
  combinedKeyDuplicate: ''
};

const cfinOptions = [
  {
    categoryName: 'POS Customers',
    options: [
      {
        label: 'Assign  New Central finance POS code',
        startCode: null,
      },
    ],
  },
  {
    categoryName: 'Intercompany Payables',
    options: [
      {
        label: 'Assign  New Central finance 90XXXXX code',
        startCode: 9000000,
      },
      {
        label: 'Assign  New Central finance 92XXXXX code',
        startCode: 9200000,
      },
      {
        label: 'Assign  New Central finance 98XXXXX code',
        startCode: 9800000,
      },
    ],
  },
  {
    categoryName: 'other',
    options: [
      {
        label: 'Assign New Central finance code',
        startCode: null,
      },
    ],
  },
];

const mockCategoryGroupMatching = [
  {
    origin: 'SAP GAMMA',
    bpGrouping: 'BP01',
    accountGroup: '0001',
    category: 'Trade Payables',
  },
  {
    origin: 'SAP GAMMA',
    bpGrouping: 'BP02',
    accountGroup: '0005',
    category: 'Non Trade Payables',
  },
  {
    origin: 'SAP GAMMA',
    bpGrouping: 'BP05',
    accountGroup: '0009',
    category: 'Intercompany Payables',
  },
  {
    origin: 'SAP GAMMA',
    bpGrouping: 'BP04',
    accountGroup: '0008',
    category: 'Employee Payables',
  },
  {
    origin: 'SAP GAMMA',
    bpGrouping: 'BP05',
    accountGroup: '0009',
    category: 'Don’t use',
  },
  {
    origin: 'SAP Corporate',
    bpGrouping: 'BP01',
    accountGroup: '0001',
    category: 'Trade Payables',
  },
  {
    origin: 'SAP Corporate',
    bpGrouping: 'BP02',
    accountGroup: '0005',
    category: 'Non Trade Payables',
  },
  {
    origin: 'SAP Corporate',
    bpGrouping: 'BP02',
    accountGroup: '0005',
    category: 'Intercompany Payables',
  },
  {
    origin: 'SAP Corporate',
    bpGrouping: 'BP05',
    accountGroup: '0009',
    category: 'Intercompany Payables',
  },
  {
    origin: 'SAP Corporate',
    bpGrouping: 'BP98',
    accountGroup: '0098',
    category: 'Intercompany Payables',
  },
  {
    origin: 'SAP Corporate',
    bpGrouping: 'BP04',
    accountGroup: '0008',
    category: 'Employee Payables',
  },
  {
    origin: 'SAP Corporate',
    bpGrouping: 'BP02',
    accountGroup: '0005',
    category: 'Employee Payables',
  },
  {
    origin: 'SAP Corporate',
    bpGrouping: 'BP07',
    accountGroup: '0007',
    category: 'POS Customers',
  },
];

const mockDropdown: Dropdown = MockService(Dropdown, {
  hide: jest.fn().mockClear,
  show: jest.fn().mockClear,
});

const eventEmitter = new EventEmitter<boolean>();

const mockCentralRepoService: CentralRepositoryService = MockService(
  CentralRepositoryService,
  {
    saveChanges: jest
      .fn()
      .mockImplementation((record) => of({ ...mockRecord, ...record })),
    getCfinOptions: jest.fn().mockReturnValue(of(cfinOptions)),
    getCfinCode: jest.fn().mockReturnValue(of('123321')),
    getDuplicates: jest.fn().mockReturnValue(of([mockRecord, mockRecord])),
    getCategoryGroupMatching: jest
      .fn()
      .mockReturnValue(of(mockCategoryGroupMatching)),
    getVendorCustomerDataFilters: jest.fn().mockReturnValue(of([])),
    recordViewClearFilters: eventEmitter
  }
);

const mockSessionStorageService: SessionStorageService = MockService(
  SessionStorageService,
  {
    retrieve: jest.fn().mockReturnValue(mockCategoryGroupMatching)
  }
);

describe('DuplicatesTableComponent', () => {
  let component: DuplicatesTableComponent;
  let fixture: ComponentFixture<DuplicatesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicatesTableComponent, Table],
      imports: [TestingModule],
      providers: [
        {
          provide: CentralRepositoryService,
          useValue: mockCentralRepoService,
        },
        {
          provide: SessionStorageService,
          useValue: mockSessionStorageService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DuplicatesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the new cfin', () => {
    component.currentRecord = { ...mockRecord };
    component.cfinSelection = mockDropdown;
    component.ngOnInit();

    component.getNewCfinCode();

    expect(component.editedRecord.cfinCode).toEqual('123321');
  });

  it('should save the new cfin code', () => {
    component.currentRecord = { ...mockRecord };
    component.cfinSelection = mockDropdown;

    jest.spyOn(mockCentralRepoService, 'getCfinCode');

    component.ngOnInit();

    component.getNewCfinCode();

    expect(mockCentralRepoService.getCfinCode).toHaveBeenCalled();
  });

  it('should show the panel options', () => {
    component.currentRecord = { ...mockRecord };
    component.cfinSelection = mockDropdown;
    component.ngOnInit();

    component.showOptions();

    expect(component.currentRecord.cfinCode).toEqual(9200005);
  });

  it('should have paginator', () => {
    component.tableData = [];
    expect(component.hasPaginator()).toBeFalsy();
  });

  it('should check cfin validation', () => {
    component.ngOnInit();

    component.editedRecord.cfinCode = 888888;
    component.editedRecord.category = 'Employee Payables';
    component.validateCfin();
    expect(component.validCfin).toBeTruthy();

    component.editedRecord.cfinCode = 999999;
    component.editedRecord.category = 'Intercompany Payables';
    component.validateCfin();
    expect(component.validCfin).toBeTruthy();

    component.editedRecord.cfinCode = 555555;
    component.editedRecord.category = 'Non Trade Payables';
    component.validateCfin();
    expect(component.validCfin).toBeTruthy();

    component.editedRecord.cfinCode = 777777;
    component.editedRecord.category = 'POS Customers';
    component.validateCfin();
    expect(component.validCfin).toBeTruthy();

    component.editedRecord.cfinCode = 111111;
    component.editedRecord.category = 'Trade Payables';
    component.validateCfin();
    expect(component.validCfin).toBeTruthy();

    component.editedRecord.cfinCode = 333333;
    component.editedRecord.category = 'Don’t use';
    component.validateCfin();
    expect(component.validCfin).toBeTruthy();

    component.editedRecord.cfinCode = 444444;
    component.editedRecord.category = 'Non Trade Payables';
    component.validateCfin();
    expect(component.validCfin).toBeFalsy();
  });

  it('should set loading to true and call services with correct params', () => {
    component.currentRecord = mockRecord;
    component.tableFilters = new CentralRepositoryFilters();

    component.tableFilters.selectedStatus = [{ value: 'status1' }];
    component.tableFilters.selectedOrigin = [{ value: 'origin1' }];
    component.tableFilters.selectedVendor = [{ value: 'vendor1' }];
    component.tableFilters.selectedCustomer = [{ value: 'customer1' }];
    component.tableFilters.selectedCategory = [{ value: 'category1' }];
    component.tableFilters.selectedBpGrouping = [{ value: 'bpGroup1' }];
    component.tableFilters.selectedAccountGroup = [{ value: 'accountGroup1' }];

    component.searchWithFilters();

    const expectedParams = {
      bpGroupings: ['bpGroup1'],
      accountGroups: ['accountGroup1'],
      categories: ['category1'],
      cfinCode: '',
      city: '',
      comment: '',
      country: '',
      customerCodes: ['customer1'],
      district: '',
      exportedBy: '',
      exportedOn: '',
      oneTimeAccounts: [],
      faxNumber: '',
      group: '',
      language: '',
      name1: '',
      name2: '',
      origins: ['origin1'],
      poBox: '',
      postalCode: '',
      region: '',
      retrievedOn: '',
      searchTerm: '',
      statuses: ['status1'],
      street: '',
      taxNumber1: '',
      telephone1: '',
      title: '',
      tradingPartner: '',
      updatedBy: '',
      updatedOn: '',
      vatTaxComparable: '',
      url: '',
      vatRegistrationNumber: '',
      vendorCodes: ['vendor1'],
      vendorCustomerCode: '',
    };

    expect(mockCentralRepoService.getDuplicates).toHaveBeenCalledWith(
      component.currentRecord.id,
      expectedParams
    );
  });

  it('should set loading to false and update duplicates on success', () => {
    component.tableFilters = new CentralRepositoryFilters();

    component.currentRecord = mockRecord;

    component.searchWithFilters();

    expect(component.tableData).toEqual([mockRecord, mockRecord]);
    expect(component.totalRecords).toBe(2);
  });

  it('should set empty filters', () => {
    component.tableFilters = new CentralRepositoryFilters();
    component.tableFilters.accountGroup = [{value: '0005'}];

    component.ngOnInit();

    mockCentralRepoService.recordViewClearFilters.emit();

    fixture.whenStable().then(() => {
      expect(component.tableFilters?.accountGroup).toBeUndefined();
    });
  });

  it('should emit save changes', () => {
    jest.spyOn(component.isSaving, 'emit');

    component.saveChanges();

    expect(component.isSaving.emit).toHaveBeenCalled();
  });

  it('should test bpGrouping and account Group selection', () => {
    component.setDropdownsOptions(true, false);

    expect(component.cfinStart).toBeFalsy();

    component.setDropdownsOptions(false, true);

    expect(component.cfinStart).toBeFalsy();

    component.setDropdownsOptions(false, false);

    expect(component.cfinStart).toBeFalsy();
  });
});
