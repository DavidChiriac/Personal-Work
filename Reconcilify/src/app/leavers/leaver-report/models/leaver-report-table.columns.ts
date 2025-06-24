/* eslint-disable max-lines-per-function */

import { IColumn } from '../../../shared/interfaces/column.interface';

export class LeaverReportColumns {
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
        field: 'sourceSystemName',
        header: 'HR Source System',
        sortable: true,
        filterable: true,
        filterMultiselect: true,
        filterField: 'selectedSourceSystem',
      },
      {
        field: 'name',
        header: 'User Name',
        filterField: 'name',
        sortable: true,
        filterable: true,
      },
      {
        field: 'employeeId',
        header: 'Employee ID',
        sortable: true,
        filterable: true,
        filterField: 'employeeId',
      },
      {
        field: 'userId',
        header: 'User ID',
        sortable: true,
        filterable: true,
        filterField: 'userId',
      },
      {
        field: 'domainAccId',
        header: 'Domain Account ID',
        filterable: true,
        filterField: 'domainAccId',
        sortable: true,
      },
      {
        field: 'email',
        header: 'Email',
        filterField: 'email',
        sortable: true,
        filterable: true,
      },
      {
        field: 'terminationDate',
        header: 'Terminated',
        filterable: true,
        filterField: 'terminationDate',
        sortable: true,
        datepicker: true,
        dateRange: true,
        showWeek: true,
        dynamicDateSelection: true
      },
      {
        field: 'terminationRecordedOn',
        header: 'Termination Recorded On',
        filterable: true,
        filterField: 'terminationRecordedOn',
        sortable: true,
        datepicker: true,
        dateRange: true,
        showWeek: true,
        dynamicDateSelection: true
      },
      {
        field: 'isBackdatedLeaver',
        header: 'Backdated Leaver',
        filterable: true,
        filterField: 'selectedBackdatedLeaver',
        sortable: true,
        filterMultiselect: true
      },
      {
        field: 'retrievedOn',
        header: 'Retrieved On',
        filterable: true,
        filterField: 'retrievedOn',
        sortable: true,
        datepicker: true,
        dateRange: true,
        showWeek: true,
        dynamicDateSelection: true
      }
    ];

    return this.columns;
  }
}
