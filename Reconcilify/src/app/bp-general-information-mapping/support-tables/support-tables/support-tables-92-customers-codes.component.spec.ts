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
import { SortDirectionEnum } from '../../../shared/utils/sort-directions';

const mockCfinDtos = {
  posDTOS: [
    {
      id: 1,
      cfinCode: 9200000,
      vendorCustomerName: 'Loan USD ING (3rd)',
    },
    {
      id: 2,
      cfinCode: 9200001,
      vendorCustomerName: 'Dufry Interest - GBP',
    },
    {
      id: 3,
      cfinCode: 9200002,
      vendorCustomerName: 'Loan CHF ING (3rd)',
    },
    {
      id: 4,
      cfinCode: 9200003,
      vendorCustomerName: 'Loan CHF (MM)',
    },
    {
      id: 5,
      cfinCode: 9200004,
      vendorCustomerName: 'Loan GBP ING (3rd)',
    },
    {
      id: 6,
      cfinCode: 9200005,
      vendorCustomerName: 'LUIS GUSTAVO HERNANDEZ BASTIDA',
    },
  ],
  filters: {
    pageSize: 20,
    pageNumber: 0,
    numberOfPages: 1,
    numberOfRecords: 6,
    lastPage: true,
    firstPage: true,
  },
};

const mockSupportTablesService: SupportTablesService = MockService(
  SupportTablesService,
  {
    get92CfinCodesTableData: jest.fn().mockReturnValue(of(mockCfinDtos)),
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
                  path: '92-cfin-codes',
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

    expect(component.tableType).toEqual(TableTypesEnum['92_CFIN_CODES']);
  });

  it('should get the 92 codes table data', () => {
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

  it('should clear all filters and reset properties', () => {
    // Arrange
    const tableFiltersSpy = jest.spyOn(component.tableFilters, 'reset');
    const tableRefSpy = jest.spyOn(component.tableRef, 'reset');

    // Act
    component.clearFilters();

    // Assert
    expect(tableFiltersSpy).toHaveBeenCalled();
    expect(tableRefSpy).toHaveBeenCalled();
  });

  it('should set pagination parameters correctly when event is provided', () => {
    // Arrange
    const event = {
      rows: 10,
      first: 20,
      sortField: 'fieldName',
      sortOrder: 1,
    };

    // Act
    component.setupPagination(event);

    // Assert
    expect(component.posCfinParams.pageSize).toEqual(10);
    expect(component.posCfinParams.pageNumber).toEqual(2);
    expect(component.posCfinParams.fieldToSort).toEqual('fieldName');
    expect(component.posCfinParams.sortDirection).toEqual(SortDirectionEnum.ASC);
  });

  it('should set pagination parameters correctly when event is not provided', () => {
    // Act
    component.setupPagination();

    // Assert
    expect(component.posCfinParams.pageSize).toEqual(20);
    expect(component.posCfinParams.pageNumber).toEqual(0);
    expect(component.posCfinParams.fieldToSort).toEqual('');
    expect(component.posCfinParams.sortDirection).toEqual(SortDirectionEnum.DESC);
  });
});
