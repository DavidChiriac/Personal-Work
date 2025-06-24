import { ShortenNumberPipe } from './shorten-number.pipe';

describe('ShortenNumberPipe', () => {
  let pipe: ShortenNumberPipe;

  beforeEach(() => {
    pipe = new ShortenNumberPipe();
  });

  it('should return an empty string for undefined input', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return the number as a string if less than 1000 and not undefined', () => {
    expect(pipe.transform(999)).toBe('999');
    expect(pipe.transform(500)).toBe('500');
  });

  it('should convert numbers in thousands to K format', () => {
    expect(pipe.transform(1000)).toBe('1.0K');
    expect(pipe.transform(2500)).toBe('2.5K');
    expect(pipe.transform(999999)).toBe('1000.0K'); // Implicit check for edge case
  });

  it('should convert numbers in millions to M format', () => {
    expect(pipe.transform(1_000_000)).toBe('1.0M');
    expect(pipe.transform(2_500_000)).toBe('2.5M');
    expect(pipe.transform(999_999_999)).toBe('1000.0M'); // Edge at less than 1 billion
  });

  it('should convert numbers in billions to B format', () => {
    expect(pipe.transform(1_000_000_000)).toBe('1.0B');
    expect(pipe.transform(2_500_000_000)).toBe('2.5B');
  });

  it('should handle edge cases correctly', () => {
    expect(pipe.transform(0)).toBe('0');
    expect(pipe.transform(-100)).toBe('-100');
    expect(pipe.transform(1500)).toBe('1.5K'); // Check rounding
    expect(pipe.transform(1_250_000_000)).toBe('1.3B'); // Check rounding
  });
});
