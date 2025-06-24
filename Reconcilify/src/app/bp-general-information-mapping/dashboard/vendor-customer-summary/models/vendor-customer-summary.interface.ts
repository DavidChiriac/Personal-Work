export interface IVendorCustomerSummary {
  originLevelAggregations?: {
    [key: string]: number;
  };
  status: string;
  sapCorp: number;
  sapGamma: number;
  sapAmica: number;
  peopleSoft: number;
}
