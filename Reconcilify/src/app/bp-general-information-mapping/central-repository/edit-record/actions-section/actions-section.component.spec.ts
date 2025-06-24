import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionsSectionComponent } from './actions-section.component';
import { TestingModule } from '../../../../shared/testing.module';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CentralRepositoryService } from '../../central-repository.service';
import { MockService } from 'ng-mocks';
import { SessionStorageService } from 'ngx-webstorage';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';

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
  taxNumber1: '',
  telephone1: '0',
  faxNumber: '',
  vatRegistrationNumber: '1234567',
  vatTaxComparable: '',
  isVatTaxDuplicate: 'UNIQUE',
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
const mockPreviousRecord = '224361s';
const mockNextRecord = '224363s';

const eventEmitter = new EventEmitter<boolean>();

const mockCentralRepoService: CentralRepositoryService = MockService(
  CentralRepositoryService,
  {
    getVendor: jest.fn().mockReturnValue(of(mockRecord)),
    getNextRecord: jest.fn().mockReturnValue(of(mockNextRecord)),
    getPreviousRecord: jest.fn().mockReturnValue(of(mockPreviousRecord)),
    recordViewClearFilters: eventEmitter
  }
);

const mockSessionStorageService: SessionStorageService = MockService(
  SessionStorageService,
  {
    retrieve: jest.fn().mockReturnValue([])
  }
);

const mockRouter: Router = MockService(Router, {
  navigate: jest.fn().mockResolvedValue(null),
});

describe('ActionsSectionComponent', () => {
  let component: ActionsSectionComponent;
  let fixture: ComponentFixture<ActionsSectionComponent>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionsSectionComponent],
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of('1'),
            url: 'central-repository'
          },
        },
        {
          provide: CentralRepositoryService,
          useValue: mockCentralRepoService,
        },
        {
          provide: SessionStorageService,
          useValue: mockSessionStorageService
        },
        {
          provide: Router,
          useValue: mockRouter
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionsSectionComponent);
    component = fixture.componentInstance;
    component.currentRecord = mockRecord;
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the next record', () => {
    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(component.nextRecord).toEqual(mockNextRecord);
    });
  });

  it('should get the previous record', () => {
    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(component.previousRecord).toEqual(mockPreviousRecord);
    });
  });
  
  it('should go the previous record', () => {
    const spyOnRouterNavigate = jest.spyOn(mockRouter, 'navigate');

    component.ngOnInit();
    component.goToPreviousRecord();

    fixture.whenStable().then(() => {
      expect(spyOnRouterNavigate).toHaveBeenCalledWith(['../', mockPreviousRecord], {relativeTo: route});
    });
  });
  
  it('should go the next record', () => {
    const spyOnRouterNavigate = jest.spyOn(mockRouter, 'navigate');

    component.ngOnInit();
    component.goToNextRecord();

    fixture.whenStable().then(() => {
      expect(spyOnRouterNavigate).toHaveBeenCalledWith(['../', mockNextRecord], {relativeTo: route});
    });
  });

  it('should approve and close record view', () => {
    jest.spyOn(component, 'closeRecordView');

    component.ngOnInit();
    component.approve();
    component.closeRecordView();

    fixture.whenStable().then(() => {
      expect(component.closeRecordView).toHaveBeenCalled();
    });
  });

  it('should emmit clear filters', () => {
    jest.spyOn(component, 'clearFilters');

    component.ngOnInit();

    component.clearFilters();

    fixture.whenStable().then(() => {
      expect(component.emptyFilters).toBeTruthy();
    });
  });
});
