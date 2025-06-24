export class CfinFilters {
  [key: string]: any;

  cfinCode: number | null;  
  vendorCustomerName: string | null;

  constructor() {
    this.cfinCode = null;
    this.vendorCustomerName = null;
  }

  reset(): void {
    this.cfinCode = null;
    this.vendorCustomerName = null;
  }
}
