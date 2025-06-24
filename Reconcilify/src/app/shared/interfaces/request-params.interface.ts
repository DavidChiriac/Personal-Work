export interface IRequestParams {
  pageNumber: number;
  pageSize: number;
  fieldToSort: string | null;
  sortDirection: string | null;
  globalSearchInput: string | null;
}
