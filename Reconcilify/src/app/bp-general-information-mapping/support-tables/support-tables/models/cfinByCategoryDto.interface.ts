export interface ICategoryDto {
  category: string;
  cfinCount: number;
  maxCfin: number;
  minCfin: number;
  nextAvailableCfin: number;

  cfinCode: number;
  vendorCustomerName: string;
}

export interface IFilters {
  firstPage: boolean;
  lastPage: boolean;
  numberOfPages: number;
  numberOfRecords: number;
  pageNumber: number;
  pageSize: number;
  fieldToSort: string,
  sortDirection: string
}

export interface ICfinByCategoryDto {
  cfinDTOS: ICategoryDto[];
  filters: IFilters;
}
