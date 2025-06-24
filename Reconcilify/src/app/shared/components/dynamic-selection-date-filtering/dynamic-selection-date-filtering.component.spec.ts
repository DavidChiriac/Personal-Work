import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicSelectionDateFilteringComponent } from './dynamic-selection-date-filtering.component';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DynamicSelectionDateFilteringComponent', () => {
  let component: DynamicSelectionDateFilteringComponent;
  let fixture: ComponentFixture<DynamicSelectionDateFilteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicSelectionDateFilteringComponent],
      providers: [DatePipe],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicSelectionDateFilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('formatDateFilters()', () => {
    it('should format single date string into a Date array', () => {
      const input = '2025-06-01';
      const result = component.formatDateFilters(input);
      expect(result).toEqual([new Date('2025-06-01')]);
    });

    it('should format an array with two valid dates', () => {
      const input = ['2025-06-01', '2025-06-10'];
      const result = component.formatDateFilters(input);
      expect(result).toEqual([new Date('2025-06-01'), new Date('2025-06-10')]);
    });

    it('should format an array with one valid date and one null after transform', () => {
      const input = ['2025-06-01', ''];
      const result = component.formatDateFilters(input);
      expect(result).toEqual([new Date('2025-06-01')]);
    });
  });

  describe('changeSelectionMode()', () => {
    it('should change the selection mode', () => {
      expect(component.selectionMode).toBe('single');
      component.changeSelectionMode('range');
      expect(component.selectionMode).toBe('range');
    });
  });
});
