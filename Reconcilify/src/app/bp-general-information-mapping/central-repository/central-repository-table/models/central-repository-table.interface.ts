export interface IVendorCustomer {
  id: string;
  origin: string;
  matching?: string;
  retrievedOn: string;
  vendorCustomerCode: string;
  country: string;
  name1: string;
  name2: string;
  city: string;
  district: string;
  poBox: string;
  postalCode: string;
  region: string;
  searchTerm: string;
  street: string;
  title: string;
  group: string;
  language: string;
  taxNumber1: string;
  telephone1: string;
  faxNumber: string;
  vatRegistrationNumber: string;
  url: string;
  tradingPartner: string;
  category: string;
  cfinCode: number;
  vendor: boolean;
  customer: boolean;
  oneTimeAcc: boolean;
  bpGrouping: string;
  accountGroup: string;
  firstLetter: string;
  vatTaxComparable: string;
  comment: string;
  status: string;
  isExported: boolean;
  exportedBy: string;
  exportedOn: string;
  updatedBy: string;
  updatedOn: string;
  _selected?: boolean;
}

export interface IVendorCustomerRequestParams {
  pageSize: number;
  pageNumber: number;
  fieldToSort: string | null;
  sortDirection: string | null;
  globalSearchInput: string;
  statuses?: string[];
  matchings?: string[];
  origins?: string[];
  vendorCodes?: string[];
  customerCodes?: string[];
  oneTimeAccounts?: string[];
  categories?: string[];
  bpGroupings?: string[];
  accountGroups?: string[];
  vendorCustomerCode?: string;
  cfinCode?: string;
  name1?: string;
  name2?: string;
  searchTerm?: string;
  country?: string;
  city?: string;
  district?: string;
  poBox?: string;
  postalCode?: string;
  region?: string;
  street?: string;
  title?: string;
  group?: string;
  language?: string;
  taxNumber1?: string;
  telephone1?: string;
  faxNumber?: string;
  vatRegistrationNumber?: string;
  url?: string;
  tradingPartner?: string;
  vatTaxComparable?: string;
  comment?: string;
  retrievedOn?: string;
  exportedBy?: string;
  exportedOn?: string;
  updatedBy?: string;
  updatedOn?: string;
  statusCountDTO?: {
    newWithoutCfinCount: number;
    newWithCfinCount: number;
    mappedCount: number;
    approvedCount: number;
  };
  hasCfin?: boolean;
}

export interface IVendorCustomerFilters {
  vendorCustomerCode: string;
  cfinCode: string;
  name1: string;
  name2: string;
  searchTerm: string;
  country: string;
  city: string;
  vatTaxComparable: string;
  district: string;
  poBox: string;
  postalCode: string;
  region: string;
  street: string;
  title: string;
  group: string;
  language: string;
  taxNumber1: string;
  telephone1: string;
  faxNumber: string;
  vatRegistrationNumber: string;
  url: string;
  tradingPartner: string;
  comment: string;
  retrievedOn: string;
  exportedBy: string;
  exportedOn: string;
  updatedBy: string;
  updatedOn: string;
  statuses: string[];
  matchings: string[];
  origins: string[];
  vendorCodes: string[];
  customerCodes: string[];
  oneTimeAccounts: string[];
  categories: string[];
  bpGroupings: string[];
  accountGroups: string[];
}

export interface IVendorCustomerPrefilledParams {
  status: string;
  origin: string;
}

export interface IVendorCustomerStatusBadge {
  newWithoutCfin: {
    badge: string;
    selected: boolean;
  };
  newWithCfin: {
    badge: string;
    selected: boolean;
  };
  mapped: {
    badge: string;
    selected: boolean;
  };
  approved: {
    badge: string;
    selected: boolean;
  };
}
