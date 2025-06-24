import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassificationStatusTrackerComponent } from './classification-status-tracker.component';
import { Router } from '@angular/router';
import { ISystemMetrics } from '../../models/system-metrics.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ClassificationStatusTrackerComponent', () => {
  let component: ClassificationStatusTrackerComponent;
  let fixture: ComponentFixture<ClassificationStatusTrackerComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerSpy = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [ClassificationStatusTrackerComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
      schemas: [NO_ERRORS_SCHEMA], // Ignore child component errors in the template
    }).compileComponents();

    fixture = TestBed.createComponent(ClassificationStatusTrackerComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should bind data and totalData inputs correctly', () => {
    const mockData: ISystemMetrics[] = [
      { systemCode: 1, systemName: 'Metric 1', totalClassificationIssues: 10, totalCorrectlyClassified: 10, missingClassification: 6, incorrectClassification: 4, totalProductsNumber: 20 },
      { systemCode: 2, systemName: 'Metric 2', totalClassificationIssues: 10, totalCorrectlyClassified: 10, missingClassification: 6, incorrectClassification: 4, totalProductsNumber: 20 },
    ];
    const mockTotalData: ISystemMetrics = { systemCode: -1, systemName: 'Total Products', totalClassificationIssues: 20, totalCorrectlyClassified: 20, missingClassification: 12, incorrectClassification: 8, totalProductsNumber: 40 };

    component.data = mockData;
    component.totalData = mockTotalData;
    fixture.detectChanges();

    expect(component.data).toEqual(mockData);
    expect(component.totalData).toEqual(mockTotalData);
  });

  it('should call router.navigate when navigate method is called', () => {
    const invalidReason = 'Invalid data';
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.navigate(invalidReason, '');

    expect(navigateSpy).toHaveBeenCalledWith(['FnB-MDH/products-mapping'], { queryParams: { invalidReason, selectedSourceSystems: '' } });
  });
});
