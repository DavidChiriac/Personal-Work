import { NameCodePipe } from './name-code.pipe';

describe('NameCodePipe', () => {
  let pipe: NameCodePipe;

  beforeEach(() => {
    pipe = new NameCodePipe();
  });

  it('should transform object {code, name} to "name - code"', () => {
    const value = { code: '001', name: 'John Doe' };
    const result = pipe.transform(value);
    expect(result).toBe('001 - John Doe');
  });

  it('should return the value if it is a string', () => {
    const value = 'Some string';
    const result = pipe.transform(value);
    expect(result).toBe('Some string');
  });

  it('should return an empty string if the object is missing code or name', () => {
    const incompleteValue = { code: '001' };
    const result = pipe.transform(incompleteValue as any);
    expect(result).toBe('001');
  });
});
