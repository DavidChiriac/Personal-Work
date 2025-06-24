import { TableMultiselectOption } from '../../../../shared/utils/table-filters-utils';

export class SystemDuplicatesFilters {
  [key: string]: any;

  //multiselect filters
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
  accountGroup!: TableMultiselectOption[];
  selectedAccountGroup!: TableMultiselectOption[];
  bpGrouping!: TableMultiselectOption[];
  selectedBpGrouping!: TableMultiselectOption[];

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
  language!: string;
  taxNumber1!: string;
  telephone1!: string;
  faxNumber!: string;
  vatRegistrationNumber!: string;
  url!: string;
  tradingPartner!: string;
  retrievedOn!: string;
  retrievedBy!: string;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.origin = [];
    this.vendor = [];
    this.customer = [];
    this.oneTimeAcc = [];
    this.category = [];
    this.accountGroup = [];
    this.bpGrouping = [];

    this.emptyFilters();
  }

  checkIfFiltersAreEmpty(): boolean {
    return (
      this.selectedOrigin.length === 0 &&
      this.selectedVendor.length === 0 &&
      this.selectedCustomer.length === 0 &&
      this.selectedOneTimeAcc.length === 0 &&
      this.selectedCategory.length === 0 &&
      this.selectedAccountGroup.length === 0 &&
      this.selectedBpGrouping.length === 0 &&
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
      this.language === '' &&
      this.taxNumber1 === '' &&
      this.telephone1 === '' &&
      this.faxNumber === '' &&
      this.vatRegistrationNumber === '' &&
      this.url === '' &&
      this.tradingPartner === '' &&
      (this.retrievedOn === '' || this.retrievedOn === null) &&
      this.retrievedBy === ''
    );
  }

  emptyFilters(): void{
    this.selectedOrigin = [];
    this.selectedVendor = [];
    this.selectedCustomer = [];
    this.selectedOneTimeAcc = [];
    this.selectedCategory = [];
    this.selectedAccountGroup = [];
    this.selectedBpGrouping = [];

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
    this.language = '';
    this.taxNumber1 = '';
    this.telephone1 = '';
    this.faxNumber = '';
    this.vatRegistrationNumber = '';
    this.url = '';
    this.tradingPartner = '';
    this.retrievedOn = '';
    this.retrievedBy = '';
  }
}
