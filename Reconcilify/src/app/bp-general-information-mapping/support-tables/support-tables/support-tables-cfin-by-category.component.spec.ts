import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  SupportTablesComponent,
  TableTypesEnum,
} from './support-tables.component';
import { TestingModule } from '../../../shared/testing.module';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { MockService } from 'ng-mocks';
import { SupportTablesService } from '../support-tables.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockCfinDtos = {
  cfinDTOS: [
    {
      category: 'Employee Payables',
      cfinCount: 9,
      cfinMin: 1234,
      cfinMax: 92123458,
      nextAvailableCfin: 92123459,
    },
    {
      category: 'Intercompany Payables',
      cfinCount: 7,
      cfinMin: 123456,
      cfinMax: 92123456,
      nextAvailableCfin: 92123457,
    },
    {
      category: 'Non Trade Payables',
      cfinCount: 33,
      cfinMin: 123456,
      cfinMax: 92123487,
      nextAvailableCfin: 92123488,
    },
    {
      category: 'POS Customers',
      cfinCount: 13,
      cfinMin: 4312,
      cfinMax: 92123467,
      nextAvailableCfin: 92123468,
    },
    {
      category: 'Trade Payables',
      cfinCount: 2,
      cfinMin: 92123456,
      cfinMax: 92123457,
      nextAvailableCfin: 92123458,
    },
  ],
};

const mockFilters = {
  cfinDTOS: [
    {
      category: 'Trade Payables',
      cfinCount: 2,
      cfinMin: 92123456,
      cfinMax: 92123457,
      nextAvailableCfin: 92123458,
    },
    {
      category: 'Intercompany Payables',
      cfinCount: 7,
      cfinMin: 123456,
      cfinMax: 92123456,
      nextAvailableCfin: 92123457,
    },
    {
      category: 'Employee Payables',
      cfinCount: 9,
      cfinMin: 1234,
      cfinMax: 92123458,
      nextAvailableCfin: 92123459,
    },
    {
      category: 'POS Customers',
      cfinCount: 13,
      cfinMin: 4312,
      cfinMax: 92123467,
      nextAvailableCfin: 92123468,
    },
    {
      category: 'Non Trade Payables',
      cfinCount: 33,
      cfinMin: 123456,
      cfinMax: 92123487,
      nextAvailableCfin: 92123488,
    },
  ],
};

const mockRouter: Router = MockService(Router, {
  navigate: jest.fn().mockReturnValue(of(null)),
});

const mockSupportTablesService: SupportTablesService = MockService(
  SupportTablesService,
  {
    getCfinByCategoryTableData: jest
      .fn()
      .mockReturnValue(of(mockCfinDtos)),
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
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [
                {
                  path: 'cfin-by-category',
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

    expect(component.tableType).toEqual(TableTypesEnum.CFIN_BY_CATEGORY);
  });

  it('should get the categories', () => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.tableFilters.categories.map((a: {value: string}) => a.value).sort()).toEqual(
        mockFilters.cfinDTOS.map((value) => {
          return { value: value.category };
        }).map(a => a.value).sort()
      );
    });
  });

  it('should get the category table data', () => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.tableData).toEqual(mockCfinDtos.cfinDTOS.map(item => {return {...item, categories: item.category};}));
    });
  });
});
