export interface IVendor {
  [key: string]: string | number | null | boolean; // Index signature allowing any string key

  accountGroup: string;
  bpGrouping: string;
  category: string;
  cfinCode: number | null;
  city: string;
  comment: string | null;
  country: string;
  customer: boolean;
  district: string | null;
  exported: boolean;
  exportedBy: string;
  exportedOn: string;
  faxNumber: string | null;
  firstLetter: string;
  group: string;
  id: string;
  language: string;
  matching: string | null;
  name1: string;
  name2: string | null;
  origin: string;
  poBox: string | null;
  postalCode: string | null;
  region: string | null;
  retrievedOn: string;
  searchTerm: string | null;
  status: string;
  street: string;
  taxNumber1: string | null;
  telephone1: string | null;
  title: string;
  tradingPartner: string;
  updatedBy: string;
  updatedOn: string;
  url: string;
  vatRegistrationNumber: string;
  vatTaxComparable: string;
  vendor: boolean;
  vendorCustomerCode: string;
  oneTimeAcc: boolean | null;
  isStreetDuplicate: boolean | null;
  isNameDuplicate: boolean | null;
  isVatTaxDuplicate: string | null;
  name1Trans: string | null;
  combinedKeyDuplicate: string;
}
