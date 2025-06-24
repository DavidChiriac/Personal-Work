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
      cfinCode: 9800000,
      vendorCustomerName: 'Vinci Airports Siège',
    },
    {
      id: 2,
      cfinCode: 9800001,
      vendorCustomerName: 'BRANDED WORKS INC',
    },
    {
      id: 3,
      cfinCode: 9800002,
      vendorCustomerName: 'BYRD RETAIL GROUP, LLC',
    },
    {
      id: 4,
      cfinCode: 9800003,
      vendorCustomerName: 'HOWELL MICKENS LP',
    },
    {
      id: 5,
      cfinCode: 9800004,
      vendorCustomerName: 'TINSLEY FAMILY CONCESSIONS INC',
    },
    {
      id: 6,
      cfinCode: 9800005,
      vendorCustomerName: 'C-STRATEGIES LLC',
    },
    {
      id: 7,
      cfinCode: 9800006,
      vendorCustomerName: 'BRANCH MCGOWEN VENTURES',
    },
    {
      id: 8,
      cfinCode: 9800007,
      vendorCustomerName: 'PORAVIAN LLC',
    },
    {
      id: 9,
      cfinCode: 9800008,
      vendorCustomerName: 'SIGNATURE AFFAIRS',
    },
    {
      id: 10,
      cfinCode: 9800009,
      vendorCustomerName: 'NORTH AMERICA CONCESSIONS',
    },
    {
      id: 11,
      cfinCode: 9800010,
      vendorCustomerName: 'PMA MCD INC',
    },
    {
      id: 12,
      cfinCode: 9800011,
      vendorCustomerName: 'JACK DUGGANS PHL INC',
    },
    {
      id: 13,
      cfinCode: 9800012,
      vendorCustomerName: 'LEVITT GROUP LLC',
    },
    {
      id: 14,
      cfinCode: 9800013,
      vendorCustomerName: 'NATIONAL CONCESSIONS MANAGEMENT LLC',
    },
    {
      id: 15,
      cfinCode: 9800014,
      vendorCustomerName: 'FLYING FOOD CONCESSIONS LLC',
    },
    {
      id: 16,
      cfinCode: 9800015,
      vendorCustomerName: 'BIG CEDAR INVESTMENTS LLC',
    },
    {
      id: 17,
      cfinCode: 9800016,
      vendorCustomerName: 'AJA MANAGEMENT & TECHNICAL SERVICES',
    },
    {
      id: 18,
      cfinCode: 9800017,
      vendorCustomerName: 'AIRPORT RETAIL GROUP',
    },
    {
      id: 19,
      cfinCode: 9800018,
      vendorCustomerName: 'UKNO CATERING',
    },
    {
      id: 20,
      cfinCode: 9800019,
      vendorCustomerName: 'I LOVE CHICAGO',
    },
  ],
  filters: {
    pageSize: 20,
    pageNumber: 0,
    numberOfPages: 2,
    numberOfRecords: 33,
    lastPage: false,
    firstPage: true,
  },
};

const mockSupportTablesService: SupportTablesService = MockService(
  SupportTablesService,
  {
    get98CfinCodesTableData: jest.fn().mockReturnValue(of(mockCfinDtos)),
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
                  path: '98-cfin-codes',
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

    expect(component.tableType).toEqual(TableTypesEnum['98_CFIN_CODES']);
  });

  it('should get the 98 codes table data', () => {
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
