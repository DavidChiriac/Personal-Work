import { IColumn } from '../../../shared/interfaces/column.interface';

export class GroupAccessManagementColumns {
  static getColumns(): IColumn[] {
    return [
      { field: 'edit', header: '' },
      {
        field: 'groupName',
        header: 'Group Name',
        style: { 'min-width': '12rem', 'max-width': '12rem' },
        filterable: true,
      },
      {
        field: 'sourceSystem',
        header: 'Source System',
        style: { 'min-width': '12rem', 'max-width': '12rem' },
        filterable: true,
        filterMultiselect: true,
      },
      { field: 'createdDate', header: 'Assigned', filterable: true, datepicker: true },
      { field: 'createdBy', header: 'Assigned by', filterable: true },
      {
        field: 'lastUpdatedDate',
        header: 'Last Updated',
        datepicker: true,
        filterable: true,
      },
      { field: 'lastUpdatedBy', header: 'Last Updated by', filterable: true },
      {
        field: 'status',
        header: 'Status',
        sortableField: 'isActive',
        filterable: true,
        filterMultiselect: true,
      },
    ];
  }
}
