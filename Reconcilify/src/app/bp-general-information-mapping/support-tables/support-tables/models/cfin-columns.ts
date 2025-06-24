import { IColumn } from '../../../../shared/interfaces/column.interface';

export class CfinColumns {
  private static columns: IColumn[];

  static getColumns(): IColumn[] {
    this.columns = [
      {
        field: 'cfinCode',
        header: 'CFIN CODE',
        style: { 'min-width': '8rem', 'max-width': '14rem' },
        sortable: true,
        filterable: true,
        filterField: 'cfinCode',
        inputType: 'number'
      },
      {
        field: 'vendorCustomerName',
        header: 'Description',
        style: { 'min-width': '8rem', 'max-width': '14rem' },
        sortable: true,
        filterable: true,
        filterField: 'vendorCustomerName',
        inputType: 'text'
      }
    ];

    return this.columns;
  }
}
