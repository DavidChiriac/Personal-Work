import { DateFilteringComponent } from './date-filtering.component';
import { DatePipe } from '@angular/common';

describe('DateFilteringComponent', () => {
  let component: DateFilteringComponent;

  beforeEach(() => {
    component = new DateFilteringComponent(new DatePipe('en-US'));
  });

  it('should format a single date string', () => {
    const result = component.formatDateFilters('2025-05-20');
    expect(result).toStrictEqual('2025-05-20');
  });

  it('should format a date range array with both dates', () => {
    const result = component.formatDateFilters(['2025-01-01', '2025-01-31']);
    expect(result).toEqual([new Date('2025-01-01'), new Date('2025-01-31')]);
  });

  it('should handle a date range where end date is missing', () => {
    const result = component.formatDateFilters(['2025-01-01', '']);
    expect(result).toEqual([new Date('2025-01-01')]);
  });
});
