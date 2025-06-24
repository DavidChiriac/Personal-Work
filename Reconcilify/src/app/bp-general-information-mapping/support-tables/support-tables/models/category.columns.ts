import { IColumn } from '../../../../shared/interfaces/column.interface';

export class CategoryColumns {
  private static columns: IColumn[];

  static getColumns(): IColumn[] {
    this.columns = [
      {
        field: 'categories',
        header: 'Category',
        style: { 'min-width': '8rem', 'max-width': '14rem' },
        sortable: false,
        filterable: true,
        filterMultiselect: true,
        filterField: 'selectedCategories'
      },
      {
        field: 'cfinCount',
        header: 'Count of CFIN codes',
        filterable: true,
        sortable: true,
        filterField: 'cfinCount',
        inputType: 'number',
        style: { 'min-width': '8rem', 'max-width': '14rem' },
      },
      {
        field: 'cfinMin',
        style: { 'min-width': '8rem', 'max-width': '14rem' },
        header: 'Min of CFIN Code',
        sortable: true,
        filterField: 'minCfin',
        inputType: 'number',
        filterable: true,
      },
      {
        field: 'cfinMax',
        header: 'Max of CFIN Code',
        style: { 'min-width': '8rem', 'max-width': '14rem' },
        filterable: true,
        inputType: 'number',
        filterField: 'maxCfin',
        sortable: true,
      },
      {
        field: 'nextAvailableCfin',
        header: 'Next Available CFIN Code',
        sortable: true,
        style: { 'min-width': '8rem', 'max-width': '14rem' },
        inputType: 'number',
        filterable: true,
        filterField: 'nextAvailableCfin',
      },
    ];

    return this.columns;
  }
}
