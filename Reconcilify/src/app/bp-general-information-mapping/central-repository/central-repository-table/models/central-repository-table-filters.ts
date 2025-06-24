import { TableMultiselectOption } from '../../../../shared/utils/table-filters-utils';

export class CentralRepositoryFilters {
  [key: string]: any;

  //multiselect filters
  status!: TableMultiselectOption[];
  selectedStatus!: TableMultiselectOption[];
  matching!: TableMultiselectOption[];
  selectedMatching!: TableMultiselectOption[];
  origin!: TableMultiselectOption[];
  selectedOrigin!: TableMultiselectOption[];
  vendor!: TableMultiselectOption[];
  selectedVendor!: TableMultiselectOption[];
  customer!: TableMultiselectOption[];
  selectedCustomer!: TableMultiselectOption[];
  oneTimeAcc!: TableMultiselectOption[];
  selectedOneTimeAcc!: TableMultiselectOption[];
  category!: TableMultiselectOption[];
  selectedCategory!: TableMultiselectOption[];
  bpGrouping!: TableMultiselectOption[];
  selectedBpGrouping!: TableMultiselectOption[];
  accountGroup!: TableMultiselectOption[];
  selectedAccountGroup!: TableMultiselectOption[];

  //input filters
  vendorCustomerCode!: string;
  cfinCode!: string;
  name1!: string;
  name2!: string;
  searchTerm!: string;
  country!: string;
  city!: string;
  district!: string;
  poBox!: string;
  postalCode!: string;
  region!: string;
  street!: string;
  title!: string;
  group!: string;
  language!: string;
  taxNumber1!: string;
  telephone1!: string;
  faxNumber!: string;
  vatRegistrationNumber!: string;
  url!: string;
  tradingPartner!: string;
  vatTaxComparable!: string;
  comment!: string;
  retrievedOn!: string;
  exportedBy!: string;
  exportedOn!: string;
  updatedBy!: string;
  updatedOn!: string;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.status = [];
    this.matching = [];
    this.origin = [];
    this.vendor = [];
    this.customer = [];
    this.oneTimeAcc = [];
    this.category = [];
    this.bpGrouping = [];
    this.accountGroup = [];

    this.emptyFilters();
  }

  checkIfFiltersAreEmpty(): boolean {
    return (
      this.selectedStatus.length === 0 &&
      this.selectedMatching.length === 0 &&
      this.selectedOrigin.length === 0 &&
      this.selectedVendor.length === 0 &&
      this.selectedCustomer.length === 0 &&
      this.selectedOneTimeAcc.length === 0 &&
      this.selectedCategory.length === 0 &&
      this.selectedBpGrouping.length === 0 &&
      this.selectedAccountGroup.length === 0 &&
      this.vendorCustomerCode === '' &&
      this.cfinCode === '' &&
      this.name1 === '' &&
      this.name2 === '' &&
      this.searchTerm === '' &&
      this.country === '' &&
      this.city === '' &&
      this.district === '' &&
      this.poBox === '' &&
      this.postalCode === '' &&
      this.region === '' &&
      this.street === '' &&
      this.title === '' &&
      this.group === '' &&
      this.language === '' &&
      this.taxNumber1 === '' &&
      this.telephone1 === '' &&
      this.faxNumber === '' &&
      this.vatRegistrationNumber === '' &&
      this.url === '' &&
      this.tradingPartner === '' &&
      this.vatTaxComparable === '' &&
      this.comment === '' &&
      (this.retrievedOn === '' || this.retrievedOn === null) &&
      this.exportedBy === '' &&
      (this.exportedOn === '' || this.exportedOn === null) &&
      this.updatedBy === '' &&
      (this.updatedOn === '' || this.updatedOn === null)
    );
  }

  refineFiltersDataForRequestBody(filters: any): void {
    delete filters.selectedStatus;
    delete filters.selectedMatching;
    delete filters.selectedOrigin;
    delete filters.selectedVendor;
    delete filters.selectedCustomer;
    delete filters.selectedOneTimeAcc;
    delete filters.selectedCategory;
    delete filters.selectedBpGrouping;
    delete filters.selectedAccountGroup;
    delete filters.accountGroup;
    delete filters.bpGrouping;
    delete filters.category;
    delete filters.customer;
    delete filters.matching;
    delete filters.origin;
    delete filters.status;
    delete filters.vendor;
    delete filters.oneTimeAcc;
  }

  emptyFilters(): void{
    this.selectedStatus = [];
    this.selectedMatching = [];
    this.selectedOrigin = [];
    this.selectedVendor = [];
    this.selectedCustomer = [];
    this.selectedOneTimeAcc = [];
    this.selectedCategory = [];
    this.selectedBpGrouping = [];
    this.selectedAccountGroup = [];

    this.vendorCustomerCode = '';
    this.cfinCode = '';
    this.name1 = '';
    this.name2 = '';
    this.searchTerm = '';
    this.country = '';
    this.city = '';
    this.district = '';
    this.poBox = '';
    this.postalCode = '';
    this.region = '';
    this.street = '';
    this.title = '';
    this.group = '';
    this.language = '';
    this.taxNumber1 = '';
    this.telephone1 = '';
    this.faxNumber = '';
    this.vatRegistrationNumber = '';
    this.url = '';
    this.tradingPartner = '';
    this.vatTaxComparable = '';
    this.comment = '';
    this.retrievedOn = '';
    this.exportedBy = '';
    this.exportedOn = '';
    this.updatedBy = '';
    this.updatedOn = '';
  }
}
