import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecordComponent } from './edit-record.component';
import { TestingModule } from '../../../shared/testing.module';
import { Table } from 'primeng/table';
import { CentralRepositoryService } from '../central-repository.service';
import { MockService } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { vendorCustomerStatus } from '../../../shared/constants/vendor-customer-status.constant';
import { IVendor } from '../../../shared/interfaces/Vendor.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vendorCustomerMatching } from '../../../shared/constants/vendor-customer-matching.constant';

const mockRecord = {
  id: '224362s',
  origin: 'SAP GAMMA',
  matching: vendorCustomerMatching.duplicate,
  retrievedOn: '2024-03-18',
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
  exportedOn: '2024-03-18',
  updatedBy: '1',
  updatedOn: '2024-03-18',
  oneTimeAcc: null,
  isStreetDuplicate: null,
  isNameDuplicate: null,
  isVatNumberDuplicate: null,
  name1Trans: null,
  exported: false,
  combinedKeyDuplicate: ''
};

const vcStatus = vendorCustomerStatus;

const mockCentralRepoService: CentralRepositoryService = MockService(
  CentralRepositoryService,
  {
    getVendor: jest.fn().mockReturnValue(of(mockRecord)),
    getDuplicates: jest.fn().mockReturnValue(of([mockRecord, mockRecord])),
    saveChanges: jest
      .fn()
      .mockImplementation((record) => of({ ...mockRecord, ...record })),
    getVendorCustomerDataFilters: jest.fn().mockReturnValue(of(true)),
  }
);

describe('EditRecordComponent', () => {
  let component: EditRecordComponent;
  let fixture: ComponentFixture<EditRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditRecordComponent, Table],
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements and attributes
      providers: [
        {
          provide: CentralRepositoryService,
          useValue: mockCentralRepoService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of('1'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the current record', () => {
    component.ngOnInit();

    expect(component.currentRecord).toEqual(mockRecord);
  });

  it('should get the related records for the current record', () => {
    component.ngOnInit();

    expect(component.duplicates).toEqual([mockRecord, mockRecord]);
    expect(component.totalDuplicates).toEqual(2);
  });

  it('should approve the current record', () => {
    component.ngOnInit();

    component.currentVendorId = mockRecord.id;
    component.approveComment = 'This record is approved';
    expect(component.currentRecord).toEqual(mockRecord);

    component.canApproveFunction(true);

    expect(component.currentRecord).toEqual({
      ...mockRecord,
      comment: 'This record is approved',
      status: vcStatus.approved,
    });
    expect(component.approveModalVisible).toEqual(false);
  });

  it('should close the approve modal', () => {
    // Arrange
    component.approveModalVisible = true;

    // Act
    component.closeApproveModal();

    // Assert
    expect(component.approveModalVisible).toBe(false);
  });

  it('should show the approve modal', () => {
    // Arrange
    component.approveModalVisible = false;

    // Act
    component.showApproveDialog();

    // Assert
    expect(component.approveModalVisible).toBe(true);
  });

  it('should save changes and update currentRecord', () => {
    // Arrange
    component.currentRecord = {} as IVendor;

    // Act
    component.saveChanges(mockRecord);

    // Assert
    expect(component.currentRecord).toEqual(mockRecord);
  });

  it('should toggle the error modal', () => {
    // Arrange
    component.errorModalVisible = true;

    // Act
    component.toggleErrorModal();

    // Assert
    expect(component.errorModalVisible).toBe(false);
  });

  it('should get EditMode', () => {
    // Arrange
    const isEditing = true;

    // Act
    component.getEditMode(isEditing);

    // Assert
    expect(component.editMode).toBe(isEditing);
  });

  it('should set emptyFilters flag', () => {
    component.emptyFilters = false;

    component.filtersAreEmpty(true);

    expect(component.emptyFilters).toBeTruthy();
  });

  it('should test error cases', () => {
    mockCentralRepoService.saveChanges = jest.fn().mockReturnValueOnce(throwError(()=> {new Error('Error fetching data');}));

    component.saveChanges(mockRecord);
    expect(component.loading).toBeFalsy();

    mockCentralRepoService.saveChanges = jest.fn().mockReturnValueOnce(throwError(()=> {new Error('Error fetching data');}));
    component.canApproveFunction(true);
    expect(component.loading).toBeFalsy();
  });

  it('should set loading flag', () => {
    component.isLoading(true);

    expect(component.loading).toBeTruthy();

    component.isLoading(false);

    expect(component.loading).toBeFalsy();
  });
});
