import { _isNilOrEmpty } from '../lodash-utils';

describe('Lodash Utility Functions', () => {
  describe('_isNilOrEmpty', () => {
    it('should return true for nil or empty values', () => {
      expect(_isNilOrEmpty(null)).toBe(true);
      expect(_isNilOrEmpty(undefined)).toBe(true);
      expect(_isNilOrEmpty('')).toBe(true);
      expect(_isNilOrEmpty([])).toBe(true);
      expect(_isNilOrEmpty({})).toBe(true);
    });

    it('should return false for non-nil or non-empty values', () => {
      expect(_isNilOrEmpty('value')).toBe(false);
      expect(_isNilOrEmpty([1, 2, 3])).toBe(false);
    });
  });
});
