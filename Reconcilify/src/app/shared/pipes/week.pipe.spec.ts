import { WeekPipe } from './week.pipe';

describe('WeekPipe', () => {
  let pipe: WeekPipe;

  beforeEach(() => {
    pipe = new WeekPipe();
  });

  it('should return formatted string for valid week object', () => {
    const week = {
      weekNumber: '12/25',
      retrievedOnFrom: '2025-03-17',
      retrievedOnTo: '2025-03-23'
    };
    const result = pipe.transform(week);
    expect(result).toBe('Week 12/25 (2025-03-17 - 2025-03-23)');
  });

  it('should return empty string when input is undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('');
  });

  it('should return empty string when input is null', () => {
    const result = pipe.transform(null as any);
    expect(result).toBe('');
  });
});
