export class UserGroupFilters {
  [key: string]: any;

  //multiselect filters
  groupName!: { name: string; id: number }[];

  //input filters
  email!: string | null;
  firstName!: string | null;
  lastName!: string | null;
  createdOn!: string[] | null;
  createdOnFrom!: string | null;
  createdOnTo!: string | null;
  createdBy!: string | null;
  lastUpdatedOn!: string[] | null;
  lastUpdatedOnFrom!: string | null;
  lastUpdatedOnTo!: string | null;
  lastUpdatedBy!: string | null;
  isActive!: boolean | null;

  filterPageDTO!: {
    numberOfRecords?: number | null;
    pageNumber: number | null;
    pageSize: number | null;
  };

  constructor() {
    this.reset();
  }

  reset(): void {
    this.emptyFilters();
  }

  emptyFilters(): void {
    this.isActive = null;
    this.createdBy = null;
    this.createdOn = null;
    this.lastUpdatedBy = null;
    this.lastUpdatedOn = null;
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.groupName = [];

    this.filterPageDTO = {
      numberOfRecords: null,
      pageNumber: null,
      pageSize: null,
    };
  }

  filtersAreEmpty(): boolean {
    return (
      !this.createdBy &&
      !this.createdOn &&
      !this.lastUpdatedBy &&
      !this.lastUpdatedOn &&
      !this.email &&
      !this.firstName &&
      !this.lastName &&
      !this.isActive &&
      !(this.groupName && this.groupName.length > 0)
    );
  }
}
