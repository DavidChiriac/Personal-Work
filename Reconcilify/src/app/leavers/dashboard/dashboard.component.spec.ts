import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { LeaversService } from '../leavers.service';
import { of } from 'rxjs';
import { ILeaversKpis } from './models/leavers-kpi.interface';
import { ShortenNumberPipe } from '../../shared/pipes/shorten-number.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockDashboardService: jest.Mocked<DashboardService>;
  let mockLeaversService: jest.Mocked<LeaversService>;

  const mockData: ILeaversKpis = {
    acknowledgementRate: 0,
    pendingAcknowledgementTasks: 5,
    previousDayLeavers: 1,
    currentWeekLeavers: 3,
    currentMonthLeavers: 7,
    yearToDateLeavers: 12,
    totalAcknowledgementTasks: 10,
    currentWeekBackdatedLeavers: 5
  };

  beforeEach(async () => {
    mockDashboardService = {
      getDashboardData: jest.fn().mockReturnValue(of(mockData)),
    } as any;

    mockLeaversService = {
      navigateToTasks: jest.fn(),
      navigateToLeaverReport: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent, ShortenNumberPipe],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: LeaversService, useValue: mockLeaversService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and process dashboard data on init', () => {
    expect(mockDashboardService.getDashboardData).toHaveBeenCalled();
    expect(component.data).toEqual({
      ...mockData
    });
  });

  it('should call navigateToTasks with true', () => {
    component.navigateToTasks(true);
    expect(mockLeaversService.navigateToTasks).toHaveBeenCalledWith(true);
  });

  it('should call navigateToLeaverReport with filter', () => {
    component.navigateToLeaverReport('week');
    expect(mockLeaversService.navigateToLeaverReport).toHaveBeenCalledWith('week');
  });
});
