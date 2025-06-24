import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorCustomerSummaryComponent } from './vendor-customer-summary.component';
import { TestingModule } from '../../../shared/testing.module';
import { DashboardService } from '../dashboard.service';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';

describe('VendorCustomerSummaryComponent', () => {
  let component: VendorCustomerSummaryComponent;
  let fixture: ComponentFixture<VendorCustomerSummaryComponent>;
  const summaryDataMock = [
    {
      status: 'Approved',
      originLevelAggregations: {
        'SAP Corporate': 0,
        PeopleSoft: 0,
        'SAP GAMMA': 0,
        'SAP AMICA': 30,
        Other: 0,
      },
    },
    {
      status: 'Mapped',
      originLevelAggregations: {
        'SAP Corporate': 0,
        PeopleSoft: 50,
        'SAP GAMMA': 0,
        'SAP AMICA': 0,
        Other: 0,
      },
    },
    {
      status: 'New',
      originLevelAggregations: {
        'SAP Corporate': 0,
        PeopleSoft: 0,
        'SAP GAMMA': 20,
        'SAP AMICA': 0,
        Other: 0,
      },
    },
    {
      status: 'Total',
      originLevelAggregations: {
        Total: 100,
      },
    },
  ];

  const summaryDataMockFormatted = [
    {
      status: 'Mapped',
      sapCorp: 0,
      sapGamma: 0,
      sapAmica: 0,
      peopleSoft: 50,
    },
    {
      status: 'New',
      sapCorp: 0,
      sapGamma: 20,
      sapAmica: 0,
      peopleSoft: 0,
    },
    {
      status: 'Approved',
      sapCorp: 0,
      sapGamma: 0,
      sapAmica: 30,
      peopleSoft: 0,
    },
  ];

  const dashboardServiceMock: DashboardService = MockService(DashboardService, {
    getSummaryData: jest.fn().mockReturnValue(of(summaryDataMock)),
    uploadFinished: new EventEmitter<void>(),
  });

  const routerMock: Router = MockService(Router, {
    navigate: jest.fn().mockReturnValue(of(null)),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorCustomerSummaryComponent],
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorCustomerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should get and sort summary data', async() => {
    // act
    component.ngOnInit();
    await fixture.whenStable();

    // assert
    expect(component.summaryData).toEqual(summaryDataMockFormatted);
    expect(component.totalVendorCustomersCfin).toEqual(100);
  });

  it('should set totalVendorCustomersCfin', async() => {
    // act
    component.ngOnInit();
    await fixture.whenStable();

    // assert
    expect(component.totalVendorCustomersCfin).toEqual(100);
  });

  it('should navigate to /central-repository without queryParams if origin and row status are not provided', async() => {
    // arrange
    const spyOnRouterNavigate = jest.spyOn(routerMock, 'navigate');

    // act
    component.redirectToCentralRepository();
    await fixture.whenStable();

    // assert
    expect(spyOnRouterNavigate).toHaveBeenCalledWith(['/vcm/central-repository'], {
      queryParams: { status: 'Total' },
      replaceUrl: true,
    });
  });

  it('should navigate to /central-repository with queryParams if origin and row status are provided', async() => {
    // arrange
    const spyOnRouterNavigate = jest.spyOn(routerMock, 'navigate');
    const row = {
      status: 'New',
      sapCorp: 0,
      sapGamma: 20,
      sapAmica: 0,
      peopleSoft: 0,
    };
    const origin = 'SAP GAMMA';

    // act
    component.redirectToCentralRepository(row, origin);
    await fixture.whenStable();

    // assert
    expect(spyOnRouterNavigate).toHaveBeenCalledWith(['/vcm/central-repository'], {
      queryParams: { origin, status: row.status },
      replaceUrl: true,
    });
  });
});
