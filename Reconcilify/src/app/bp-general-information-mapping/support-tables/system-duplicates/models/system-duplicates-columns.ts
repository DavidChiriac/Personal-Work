/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-lines-per-function */

import { IColumn } from '../../../../shared/interfaces/column.interface';


export class SystemDuplicatesColumns {
  private static columns: IColumn[];

  private static createColumn(
    field: string,
    header: string,
    options: Partial<IColumn>
  ): IColumn {
    return {
      field,
      header,
      sortable: true,
      filterable: true,
      filterMultiselect: false,
      filterField: options.filterField ?? '',
      ...options,
    };
  }

  static getColumns(): IColumn[] {
    this.columns = [
      {
        field: 'delete',
        header: '',
        style: { 'min-width': '2.5rem', 'max-width': '2.5rem', padding: '0' },
        class: 'text-center',
        frozen: true,
        sortable: false,
        filterable: false,
        filterField: '',
      },
      this.createColumn('origin', 'Origin', {
        style: { 'min-width': '10rem', 'max-width': '10rem' },
        filterField: 'selectedOrigin',
        filterMultiselect: true,
        frozen: true,
      }),
      this.createColumn('vendorCustomerCode', 'Vendor/Customer Code', {
        style: { 'min-width': '10rem', 'max-width': '11.5rem' },
        filterField: 'vendorCustomerCode',
        frozen: true,
      }),
      this.createColumn('cfinCode', 'CFIN Code', {
        style: { 'min-width': '5rem', 'max-width': '7rem' },
        class: 'numeric-data',
        filterField: 'cfinCode',
        frozen: true,
      }),
      this.createColumn('vendor', 'Vendor', {
        style: { 'min-width': '8rem', 'max-width': '10rem' },
        filterField: 'selectedVendor',
        filterMultiselect: true,
        frozen: true,
      }),
      this.createColumn('customer', 'Customer', {
        style: { 'min-width': '8rem', 'max-width': '10rem' },
        filterField: 'selectedCustomer',
        filterMultiselect: true,
        frozen: true,
      }),
      this.createColumn('category', 'Category', {
        style: { 'min-width': '9rem', 'max-width': '14rem' },
        filterField: 'selectedCategory',
        filterMultiselect: true,
      }),
      this.createColumn('accountGroup', 'Account Group', {
        style: { 'min-width': '8rem', 'max-width': '14rem' },
        class: 'numeric-data',
        filterField: 'selectedAccountGroup',
        filterMultiselect: true
      }),
      this.createColumn('bpGrouping', 'BP Grouping', {
        style: { 'min-width': '8rem', 'max-width': '14rem' },
        class: 'numeric-data',
        filterField: 'selectedBpGrouping',
        filterMultiselect: true
      }),
      this.createColumn('name1', 'Name 1', {
        class: '',
        style: { 'min-width': '8rem', 'max-width': '12rem' },
        filterField: 'name1',
      }),
      this.createColumn('name2', 'Name 2', {
        filterField: 'name2',
        frozen: false,
        style: { 'min-width': '8rem', 'max-width': '12rem' },
      }),
      this.createColumn('searchTerm', 'Search Term', {
        style: { 'min-width': '8rem', 'max-width': '12rem' },
        filterField: 'searchTerm',
        filterMultiselect: false,
      }),
      this.createColumn('country', 'Country', {
        style: { 'min-width': '6rem', 'max-width': '7rem' },
        class: '',
        filterField: 'country',
      }),
      this.createColumn('city', 'City', {
        sortable: true,
        style: { 'min-width': '6rem', 'max-width': '8rem' },
        filterField: 'city',
      }),
      this.createColumn('district', 'District', {
        filterField: 'district',
        frozen: false,
        style: { 'min-width': '6rem', 'max-width': '8rem' },
      }),
      this.createColumn('poBox', 'PO Box', {
        style: { 'min-width': '6rem', 'max-width': '8rem' },
        filterField: 'poBox',
        sortable: true,
      }),
      this.createColumn('postalCode', 'Postal Code', {
        style: { 'min-width': '6rem', 'max-width': '8rem' },
        filterMultiselect: false,
        filterField: 'postalCode',
      }),
      this.createColumn('region', 'Region', {
        class: '',
        style: { 'min-width': '4rem', 'max-width': '6rem' },
        filterField: 'region',
      }),
      this.createColumn('street', 'Street', {
        style: { 'min-width': '8rem', 'max-width': '14rem' },
        sortable: true,
        filterField: 'street',
      }),
      this.createColumn('title', 'Title', {
        style: { 'min-width': '5rem', 'max-width': '7rem' },
        filterMultiselect: false,
        filterField: 'title',
      }),
      this.createColumn('language', 'Language', {
        style: { 'min-width': '6rem', 'max-width': '7rem' },
        class: '',
        filterField: 'language',
      }),
      this.createColumn('taxNumber1', 'Tax Number 1', {
        style: { 'min-width': '6rem', 'max-width': '9rem' },
        class: 'numeric-data',
        filterField: 'taxNumber1',
      }),
      this.createColumn('telephone1', 'Telephone 1', {
        class: 'numeric-data',
        filterField: 'telephone1',
        style: { 'min-width': '6rem', 'max-width': '9rem' },
      }),
      this.createColumn('faxNumber', 'Fax Number', {
        style: { 'min-width': '6rem', 'max-width': '9rem' },
        class: 'numeric-data',
        filterField: 'faxNumber',
      }),
      this.createColumn('vatRegistrationNumber', 'VAT Registration Number', {
        style: { 'min-width': '12rem', 'max-width': '12rem' },
        class: 'numeric-data',
        filterField: 'vatRegistrationNumber',
      }),
      this.createColumn('url', 'URL', {
        style: { 'min-width': '8rem', 'max-width': '14rem' },
        filterField: 'url',
      }),
      this.createColumn('tradingPartner', 'Trading Partner', {
        style: { 'min-width': '8rem', 'max-width': '10rem' },
        filterField: 'tradingPartner',
      }),
      this.createColumn('oneTimeAcc', 'OneTimeACC', {
        style: { 'min-width': '8rem', 'max-width': '10rem' },
        filterField: 'selectedOneTimeAcc',
        filterMultiselect: true,
      }),
      this.createColumn('retrievedBy', 'Retrieved By', {
        style: { 'min-width': '7rem', 'max-width': '9rem' },
        filterField: 'retrievedBy',
      }),
      this.createColumn('retrievedOn', 'Retrieved On', {
        class: 'numeric-data',
        style: { 'min-width': '7rem', 'max-width': '9rem' },
        filterField: 'retrievedOn',
        datepicker: true,
      }),
    ];

    return this.columns;
  }
}
