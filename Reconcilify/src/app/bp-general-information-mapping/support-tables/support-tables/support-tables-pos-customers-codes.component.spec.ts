import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  SupportTablesComponent,
  TableTypesEnum,
} from './support-tables.component';
import { TestingModule } from '../../../shared/testing.module';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { MockService } from 'ng-mocks';
import { SupportTablesService } from '../support-tables.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockCfinDtos = {
  posDTOS: [
    {
      id: 1,
      cfinCode: 7000001,
      vendorCustomerName: 'Anonymous Domestic Customer',
    },
    {
      id: 2,
      cfinCode: 7000002,
      vendorCustomerName: 'Anonymous International Customer',
    },
    {
      id: 3,
      cfinCode: 7000003,
      vendorCustomerName: 'Anonymous European Customer',
    },
    {
      id: 4,
      cfinCode: 7000004,
      vendorCustomerName: 'Anonymous Transit Customer',
    },
    {
      id: 5,
      cfinCode: 7000005,
      vendorCustomerName: 'Anonymous Inflight Customer',
    },
    {
      id: 6,
      cfinCode: 7000006,
      vendorCustomerName: 'Anonymous Staff Customer',
    },
    {
      id: 7,
      cfinCode: 7000007,
      vendorCustomerName: 'Anonymous Diplomat Customer',
    },
    {
      id: 8,
      cfinCode: 7000008,
      vendorCustomerName: 'Anonymous Pickup Customer',
    },
    {
      id: 9,
      cfinCode: 7000009,
      vendorCustomerName: 'Dummy POS Customer',
    },
    {
      id: 10,
      cfinCode: 7000011,
      vendorCustomerName: 'New test',
    },
  ],
  filters: {
    pageSize: 20,
    pageNumber: 0,
    numberOfPages: 1,
    numberOfRecords: 10,
    lastPage: true,
    firstPage: true,
  },
};

const mockSupportTablesService: SupportTablesService = MockService(
  SupportTablesService,
  {
    getPosCustomersCodesTableData: jest.fn().mockReturnValue(of(mockCfinDtos)),
  }
);

describe('SupportTableComponent', () => {
  let component: SupportTablesComponent;
  let fixture: ComponentFixture<SupportTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportTablesComponent, Table],
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: SupportTablesService,
          useValue: mockSupportTablesService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [
                {
                  path: 'pos-customers-codes',
                },
              ],
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the correct table type', () => {
    component.ngOnInit();

    expect(component.tableType).toEqual(TableTypesEnum.POS_CFIN_CODES);
  });

  it('should get the pos table data', () => {
    component.ngOnInit();

    expect(component.tableData).toEqual(
      mockCfinDtos.posDTOS.map((value) => {
        return {
          cfinCode: value.cfinCode,
          vendorCustomerName: value.vendorCustomerName,
        };
      })
    );
  });
});
