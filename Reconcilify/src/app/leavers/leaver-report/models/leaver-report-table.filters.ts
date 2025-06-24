export class LeaverReportFilters {
  [key: string]: any;

  //multiselect filters
  sourceSystemName!: string[] | null;
  selectedSourceSystem!: string[] | null;

  isBackdatedLeaver!: boolean[] | null;
  selectedBackdatedLeaver!: boolean[] | null;

  //input filters
  name!: string | null;
  email!: string | null;
  userId!: string | null;
  employeeId!: string | null;
  domainAccId!: string | null;
  terminationDate!: string[] | null;
  terminationRecordedOn!: string[] | null;
  retrievedOn!: string[] | null;
  filterPageDTO?: {pageSize?: number | null, pageNumber?: number | null, numberOfRecords?: number | null};
  terminationDateFrom!: string | null;
  terminationDateTo!: string | null;
  terminationRecordedOnFrom!: string | null;
  terminationRecordedOnTo!: string | null;
  retrievedOnFrom!: string | null;
  retrievedOnTo!: string | null;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.sourceSystemName = null;
    this.isBackdatedLeaver = null;

    this.emptyFilters();
  }

  emptyFilters(): void {
    this.name = null;
    this.email = null;
    this.userId = null;
    this.employeeId = null;
    this.domainAccId = null;
    this.terminationDate = null;
    this.terminationRecordedOn = null;
    this.selectedBackdatedLeaver = null;
    this.retrievedOn = null;
    this.filterPageDTO = {numberOfRecords: null, pageNumber: null, pageSize: null};
    this.terminationDateFrom = null;
    this.terminationDateTo = null;
    this.retrievedOnFrom = null;
    this.retrievedOnTo = null;
    this.selectedSourceSystem = null;
  }

  filtersAreEmpty(): boolean {
    return (
      (!this.selectedSourceSystem || this.selectedSourceSystem.length === 0) &&
      (!this.selectedBackdatedLeaver || this.selectedBackdatedLeaver.length === 0) &&
      !this.name &&
      !this.email &&
      !this.userId &&
      !this.employeeId &&
      !this.domainAccId &&
      !this.terminationDate &&
      !this.terminationDateFrom &&
      !this.terminationDateTo &&
      !this.terminationRecordedOn &&
      !this.terminationRecordedOnFrom &&
      !this.terminationRecordedOnTo &&
      !this.retrievedOn &&
      !this.retrievedOnFrom &&
      !this.retrievedOnTo
    );
  }
}
