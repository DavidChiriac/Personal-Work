export interface IProduct {
  id: number;
  sourceSystemDesc: string;
  itemCode: string;
  itemName: string;
  globalCategoryName: codeNameAttribute;
  globalGroupName: codeNameAttribute;
  globalSubgroupName: codeNameAttribute;
  localCategoryName: codeNameAttribute;
  localGroupName: codeNameAttribute;
  localSubgroupName: codeNameAttribute;
  validationStatus: string;
  invalidityReasonMessage: string;
  proposedCategoryName: codeNameAttribute;
  proposedGroupName: codeNameAttribute;
  proposedSubgroupName: codeNameAttribute;
  comment: string;
  retrievedOn: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  _selected?: boolean;
}

export type codeNameAttribute = {
  code: string; 
  name: string;
}

export interface IItemDto {
  id: number;
  systemId: number;
  sourceSystemDesc: string;
  itemCode: string;
  itemName: string;
  globalCategoryCode: string;
  globalCategoryName: string;
  globalGroupCode: string;
  globalGroupName: string;
  globalSubgroupCode: string;
  globalSubgroupName: string;
  proposedCategoryCode: string;
  proposedCategoryName: string;
  proposedGroupCode: string;
  proposedGroupName: string;
  proposedSubgroupCode: string;
  proposedSubgroupName: string;
  localSubgroupCode: string;
  localSubgroupName: string;
  localCategoryCode: string;
  localCategoryName: string;
  localGroupName: string;
  localGroupCode: string;
  invalidityReasonType: string;
  invalidityReasonMessage: string;
  validationStatus: number;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  retrievedOn: string;
  comment: string;
}

export interface IProductRequestParams {
  pageSize: number;
  pageNumber: number;
  fieldToSort: string | null | undefined;
  sortDirection: string | null | undefined;
  globalSearchInput: string | null | undefined;
}

export interface IProductFilters {
  selectedSourceSystems: string[];
  sourceSystemDesc: string[];
  sourceSystemName: string | null;
  selectedStatus: string[] | null;
  validationStatus: string[];
  itemCode: string | null;
  itemName: string | null;
  globalCategoryName: string | null;
  globalCategoryCode: string | null;
  globalGroupName: string | null;
  globalGroupCode: string | null;
  globalSubgroupName: string | null;
  globalSubgroupCode: string | null;
  localSubgroupName: string | null;
  localSubgroupCode: string | null;
  localCategoryName: string | null;
  localCategoryCode: string | null;
  localGroupName: string | null;
  localGroupCode: string | null;
  invalidityReasonMessage: string | null;
  invalidityReasonTypes: string[] | null;
  proposedCategoryName: string | null;
  proposedCategoryCode: string | null;
  proposedGroupName: string | null;
  proposedGroupCode: string | null;
  proposedSubgroupName: string | null;
  proposedSubgroupCode: string | null;
  comment: string | null;
  retrievedOn: string | null;
  lastUpdatedAt: string | null;
  lastUpdatedBy: string | null;
}

export interface IItemFilterDTO {
  id: string;
  systemId: number[];
  sourceSystemDesc: string[] | null;
  itemCode: string | null;
  itemName: string | null;
  globalCategoryCode: string | null;
  globalCategoryName: string | null;
  globalGroupCode: string | null;
  globalGroupName: string | null;
  globalSubgroupCode: string | null;
  globalSubgroupName: string | null;
  proposedCategoryCode: string | null;
  proposedCategoryName: string | null;
  proposedGroupCode: string | null;
  proposedGroupName: string | null;
  proposedSubgroupCode: string | null;
  proposedSubgroupName: string | null;
  localSubgroupCode: string | null;
  localSubgroupName: string | null;
  localCategoryCode: string | null;
  localCategoryName: string | null;
  localGroupName: string | null;
  localGroupCode: string | null;
  invalidityReasonTypes: string[] | null;
  invalidityReasonMessage: string | null;
  validationStatus: number[] | null;
  comment: string | null;
  globalSearchTerm: string | null;
  fieldToSort: string | null;
  sortDirection: string | null;
  lastUpdatedAt: string | null;
  lastUpdatedBy: string | null;
  retrievedOn: string | null;
  updatedBy: string | null;
  extendedFilterPageDTO: IExtendedFilterPageDTO;
}

export interface IExtendedFilterPageDTO{
  pageSize?: number;
  pageNumber?: number;
  numberOfRecords?: number;
}

export interface IItemDataFilterDTO {
  filterValues: {
    sourceSystemDesc: string[];
    validationStatus: number[];
  };
  itemCountDTO: {
    totalValidItems: number;
    totalInvalidItems: number;
    totalPendingItems: number;
    totalItems: number;
  }
}
