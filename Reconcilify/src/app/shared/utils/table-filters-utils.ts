/* eslint-disable  @typescript-eslint/no-explicit-any */
export class TableFiltersUtils {
  static convertToMultiselectOption(items: any[]): TableMultiselectOption[] {
    return items?.map((item) => {
      const multiselectOption: TableMultiselectOption = {
        value: item
      };
      return multiselectOption;
    });
  }
}

export class TableMultiselectOption {
  id?: any;
  value?: any;
}
