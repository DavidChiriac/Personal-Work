/* eslint-disable max-lines-per-function */

import { IColumn } from '../../../shared/interfaces/column.interface';

export class LeaverReportAcknowledgementColumns {
  [key: string]: any;

  private static columns: IColumn[];

  static getColumns(): IColumn[] {
    this.columns = [
      {
        field: 'selection',
        header: '',
        style: { 'min-width': '1rem', 'max-width': '1rem' },
        sortable: false,
        filterable: false,
        filterField: '',
        fixedFrozen: true
      },
      {
        field: 'id',
        header: '#',
        filterField: '',
      },
      {
        field: 'taskTitle',
        header: 'Task Name',
        filterField: 'taskTitle',
        sortable: true,
        filterable: true,
      },
      {
        field: 'week',
        header: 'Week',
        sortable: true,
        filterable: true,
        filterField: 'week',
        filterMultiselect: true,
        showWeek: true,
        datepicker: true,
        dateRange: true,
        dynamicDateSelection: true
      },
      {
        field: 'createdOn',
        header: 'Creation Date',
        sortable: true,
        filterable: true,
        filterField: 'createdOn',
        datepicker: true,
        dateRange: true,
        showWeek: true,
        dynamicDateSelection: true
      },
      {
        field: 'assignee',
        header: 'Assignee',
        filterable: true,
        filterField: 'assignee',
        sortable: true,
      },
      {
        field: 'leaversList',
        header: 'Leavers List',
        filterField: 'leaversList',
        sortable: true,
        filterable: true,
      },
      {
        field: 'taskDescription',
        header: 'Task Description',
        filterable: true,
        filterField: 'taskDescription',
        sortable: true,
      },
      {
        field: 'acknowledged',
        header: 'Action',
        filterable: true,
        filterField: 'selectedAcknowledged',
        sortable: true,
        filterMultiselect: true
      },
      {
        field: 'acknowledgedBy',
        header: 'Acknowledged by',
        filterable: true,
        filterField: 'acknowledgedBy',
        sortable: true,
      },
      {
        field: 'acknowledgedOn',
        header: 'Acknowledged Date',
        filterable: true,
        filterField: 'acknowledgedOn',
        sortable: true,
        datepicker: true,
        dateRange: true,
        showWeek: true,
        dynamicDateSelection: true
      },
    ];

    return this.columns;
  }
}
