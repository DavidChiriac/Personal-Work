import { TableFiltersUtils } from '../table-filters-utils';

describe('Table Filters Utils', () => {
  describe('convertToMultiselectOption', () => {
    it('should convert array items to TableMultiselectOption objects', () => {
      const items = [1, 2, 3];
      const expectedOutput = [{ value: 1 }, { value: 2 }, { value: 3 }];

      const result = TableFiltersUtils.convertToMultiselectOption(items);

      expect(result).toEqual(expectedOutput);
    });

    it('should return an empty array when input is empty', () => {
      const items: any[] = [];
      const result = TableFiltersUtils.convertToMultiselectOption(items);
      expect(result).toEqual([]);
    });
  });
});
