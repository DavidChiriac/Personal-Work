import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FnBDashboardComponent } from './dashboard.component';
import { FnBDashboardService } from './dashboard.service';
import { of } from 'rxjs';
import { ISystemMetrics } from '../models/system-metrics.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ShortenNumberPipe } from '../../shared/pipes/shorten-number.pipe';

describe('FnBDashboardComponent', () => {
  let component: FnBDashboardComponent;
  let fixture: ComponentFixture<FnBDashboardComponent>;
  let dashboardService: FnBDashboardService;

  beforeEach(async () => {
    const dashboardServiceMock = {
      getDashboardData: jest.fn().mockReturnValue(of({systemMetrics: []})),
    };

    await TestBed.configureTestingModule({
      declarations: [FnBDashboardComponent, ShortenNumberPipe],
      providers: [
        { provide: FnBDashboardService, useValue: dashboardServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FnBDashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(FnBDashboardService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call dashboardService.getDashboardData and process data on init', () => {
    const mockData: { systemMetrics: ISystemMetrics[] } = {
      systemMetrics: [
        {
          systemCode: 1,
          systemName: 'System A',
          totalProductsNumber: 100,
          totalCorrectlyClassified: 90,
          totalClassificationIssues: 10,
          missingClassification: 5,
          incorrectClassification: 3,
          classificationStatusComplianceScore: 0,
        },
        {
          systemCode: 2,
          systemName: 'System B',
          totalProductsNumber: 150,
          totalCorrectlyClassified: 130,
          totalClassificationIssues: 20,
          missingClassification: 10,
          incorrectClassification: 7,
          classificationStatusComplianceScore: 0,
        },
      ],
    };

    jest.spyOn(dashboardService, 'getDashboardData').mockReturnValue(of(mockData));

    fixture.detectChanges();

    expect(dashboardService.getDashboardData).toHaveBeenCalled();
    expect(component.data).toEqual(mockData.systemMetrics);
    expect(component.chartData).toEqual([
      { label: 'System A', totalProducts: 100, missingClassificationLevel: 5, incorrectClassification: 3},
      { label: 'System B', totalProducts: 150, missingClassificationLevel: 10, incorrectClassification: 7},
    ]);
    expect(component.totalData.totalProductsNumber).toBe(250);
    expect(component.totalData.totalClassificationIssues).toBe(30);
    expect(component.totalData.missingClassification).toBe(15);
    expect(component.totalData.incorrectClassification).toBe(10);
  });

  it('should process data correctly with updated classification status score', () => {
    const mockData: { systemMetrics: ISystemMetrics[] } = {
      systemMetrics: [
        {
          systemCode: 1,
          systemName: 'System A',
          totalProductsNumber: 100,
          totalCorrectlyClassified: 90,
          totalClassificationIssues: 10,
          missingClassification: 5,
          incorrectClassification: 3,
          classificationStatusComplianceScore: 0,
        },
      ],
    };

    jest.spyOn(dashboardService, 'getDashboardData').mockReturnValue(of(mockData));

    fixture.detectChanges();

    const processedSystem = component.data[0];
    expect(processedSystem.classificationStatusComplianceScore).toBe(90);
  });

  it('should set totalData with correct systemCode and systemName after data processing', () => {
    const mockData: { systemMetrics: ISystemMetrics[] } = {
      systemMetrics: [
        {
          systemCode: 1,
          systemName: 'System A',
          totalProductsNumber: 100,
          totalCorrectlyClassified: 90,
          totalClassificationIssues: 10,
          missingClassification: 5,
          incorrectClassification: 3,
          classificationStatusComplianceScore: 0,
        },
      ],
    };

    jest.spyOn(dashboardService, 'getDashboardData').mockReturnValue(of(mockData));

    fixture.detectChanges();

    expect(component.totalData.systemCode).toBe(-1);
    expect(component.totalData.systemName).toBe('Total Products');
  });
});
