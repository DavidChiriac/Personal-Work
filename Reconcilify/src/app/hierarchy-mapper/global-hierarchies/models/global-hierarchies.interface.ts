import { codeNameAttribute } from '../../products-mapping/models/products-mapping-table.interface';

export interface IGlobalHierarchiesTableData {
  [key: string]: any;

  id: number;
  globalCategoryName: codeNameAttribute;
  globalGroupName: codeNameAttribute;
  globalSubgroupName: codeNameAttribute;
}

export interface IGlobalHierarchies {
  id: number;
  globalCategoryName: string;
  globalCategoryCode: string;
  globalGroupName: string;
  globalGroupCode: string;
  globalSubgroupName: string;
  globalSubgroupCode: string;
}

export interface IGlobalHierarchiesRequestParams {
  pageSize: number;
  pageNumber: number;
  fieldToSort: string;
  sortDirection: string;
}

export interface IGlobalHierarchiesTableFilters {
  selectedCategory: codeNameAttribute[];
  selectedGroup: codeNameAttribute[];
  selectedSubgroup: codeNameAttribute[];
}
