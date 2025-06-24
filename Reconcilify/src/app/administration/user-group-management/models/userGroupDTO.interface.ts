export interface IUserGroupDTO {
  [key: string]: any;

  id?: number;
  adGroupId?: string;
  group?: { id: number; name: string };
  groupName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  createdOn?: string | Date;
  createdOnTime?: string;
  createdBy?: string;
  lastUpdatedOn?: string | Date;
  lastUpdatedOnTime?: string;
  lastUpdatedBy?: string;
  _selected?: boolean;
}

export interface IUserGroupFilters {
  groupName: { name: string; id: number }[];
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  createdOn: string[] | null;
  createdOnFrom: string | null;
  createdOnTo: string | null;
  createdBy: string | null;
  lastUpdatedOn: string[] | null;
  lastUpdatedOnFrom: string | null;
  lastUpdatedOnTo: string | null;
  lastUpdatedBy: string | null;
  isActive: boolean | null;
  filterPageDTO: {
    numberOfRecords?: number | null;
    pageNumber: number | null;
    pageSize: number | null;
  };
  globalSearchInput: string | null;
  fieldToSort: string | null;
  sortDirection: string | null;
}
