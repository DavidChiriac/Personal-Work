export interface IColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterField?: string;
  filterMultiselect?: boolean;
  style?: any;
  editable?: boolean;
  class?: string;
  sortableField?: string;
  hasTooltip?: boolean;
  tooltip?: string;
  frozen?: boolean;
  fixedFrozen?: boolean;
  inputType?: string;
  datepicker?: boolean;
  hasCodeAndName?: boolean;
  dateRange?: boolean;
  showWeek?: boolean;
  dynamicDateSelection?: boolean;
}
