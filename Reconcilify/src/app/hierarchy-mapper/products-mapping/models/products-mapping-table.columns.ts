/* eslint-disable max-lines-per-function */

import { IColumn } from '../../../shared/interfaces/column.interface';

export class ProductsMappingColumns {
  [key: string]: any;

  private static columns: IColumn[];

  static getColumns(): IColumn[] {
    this.columns = [
      {
        field: 'selection',
        header: '',
        style: { 'min-width': '3rem', 'max-width': '3rem' },
        sortable: false,
        filterable: false,
        filterField: '',
        fixedFrozen: true
      },
      {
        field: 'edit',
        header: '',
        style: { 'min-width': '3rem', 'max-width': '3rem' },
        sortable: false,
        filterable: false,
        filterField: '',
        fixedFrozen: true
      },
      {
        field: 'validationStatus',
        header: 'Status',
        sortable: true,
        filterable: true,
        filterMultiselect: true,
        filterField: 'selectedStatus',
        fixedFrozen: true
      },
      {
        field: 'itemCode',
        header: 'Item SKU',
        filterField: 'itemCode',
        sortable: true,
        filterable: true,
        fixedFrozen: true
      },
      {
        field: 'itemName',
        header: 'Item Description',
        sortable: true,
        filterable: true,
        filterField: 'itemName',
        fixedFrozen: true
      },
      {
        field: 'sourceSystemDesc',
        header: 'Source System',
        sortable: true,
        filterable: true,
        filterMultiselect: true,
        filterField: 'selectedSourceSystems',
      },
      {
        field: 'globalCategoryName',
        header: 'Category',
        filterable: true,
        filterField: 'globalCategoryName',
        sortableField: 'globalCategoryCode',
        sortable: true,
        hasCodeAndName: true
      },
      {
        field: 'globalGroupName',
        header: 'Group',
        filterField: 'globalGroupName',
        sortableField: 'globalGroupCode',
        sortable: true,
        filterable: true,
        hasCodeAndName: true
      },
      {
        field: 'globalSubgroupName',
        header: 'Subgroup',
        sortable: true,
        filterable: true,
        filterField: 'globalSubgroupName',
        sortableField: 'globalSubgroupCode',
        hasCodeAndName: true
      },
      {
        field: 'localCategoryName',
        header: 'Local Level 1',
        filterable: true,
        filterField: 'localCategoryName',
        sortableField: 'localCategoryCode',
        sortable: true,
        hasCodeAndName: true
      },
      {
        field: 'localGroupName',
        header: 'Local Level 2',
        filterable: true,
        filterField: 'localGroupName',
        sortableField: 'localGroupCode',
        sortable: true,
        hasCodeAndName: true
      },
      {
        field: 'localSubgroupName',
        header: 'Local Level 3',
        filterable: true,
        filterField: 'localSubgroupName',
        sortableField: 'localSubgroupCode',
        sortable: true,
        hasCodeAndName: true
      },
      {
        field: 'invalidityReasonMessage',
        header: 'Invalid Reason',
        filterable: true,
        sortable: true,
        filterField: 'invalidityReasonMessage',
      },
      {
        field: 'proposedCategoryName',
        header: 'Proposed Category',
        sortable: true,
        filterable: true,
        filterField: 'proposedCategoryName',
        sortableField: 'proposedCategoryCode',
        hasCodeAndName: true
      },
      {
        field: 'proposedGroupName',
        header: 'Proposed Group',
        sortable: true,
        filterable: true,
        filterField: 'proposedGroupName',
        sortableField: 'proposedGroupCode',
        hasCodeAndName: true
      },
      {
        field: 'proposedSubgroupName',
        header: 'Proposed Subgroup',
        sortable: true,
        filterable: true,
        filterField: 'proposedSubgroupName',
        sortableField: 'proposedSubgroupCode',
        hasCodeAndName: true
      },
      {
        field: 'comment',
        header: 'Comment',
        sortable: true,
        style: { 'min-width': '15rem', 'max-width': '15rem' },
        filterable: true,
        filterField: 'comment',
      },
      {
        field: 'retrievedOn',
        header: 'Retrieved',
        filterField: 'retrievedOn',
        filterable: true,
        datepicker: true,
        sortable: true,
      },
      {
        field: 'lastUpdatedAt',
        header: 'Last Updated',
        sortable: true,
        filterable: true,
        datepicker: true,
        filterField: 'lastUpdatedAt',
      },
      {
        field: 'lastUpdatedBy',
        filterField: 'lastUpdatedBy',
        header: 'Last Updated by',
        filterable: true,
        sortable: true,
      }
    ];

    return this.columns;
  }
}
