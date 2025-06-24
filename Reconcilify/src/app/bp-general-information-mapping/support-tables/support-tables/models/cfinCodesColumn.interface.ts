export interface ICfinCodeColumn{
  cfinCode: number;
  vendorCustomerName: string;

  category?: string;
  cfinCount?: number;
  maxCfin?: number;
  minCfin?: number;
  nextAvailableCfin?: number;
}
