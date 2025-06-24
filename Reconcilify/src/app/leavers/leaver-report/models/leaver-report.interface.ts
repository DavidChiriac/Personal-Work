export interface ILeaverReport {
    id: number,
    sourceSystemName: string,
    sourceSystemId: number,
    systemId: number,
    name: string,
    email: string,
    userId: string,
    employeeId: string,
    domainAccId: string,
    terminationDate: string,
    terminationRecordedOn: string,
    isBackdatedLeaver: boolean,
    retrievedOn: string,
    _selected?: boolean
};

export interface ILeaverReportResponseFilters{
    filterValues: {
        systemNames: string[];
        backdatedLeavers: boolean[];
    }
    leaversCountDTO: {
        previousDayLeavers: number;
        currentWeekLeavers: number;
        totalLeavers: number;
    }
}

export interface ILeaverReportFilters {
  sourceSystemName: string[];
  selectedSourceSystem: string[] | null;

  name: string | null;
  email: string | null;
  userId: string | null;
  employeeId: string | null;
  domainAccId: string | null;
  terminationDate: string[] | null;
  terminationRecordedOn: string[] | null;
  retrievedOn: string[] | null;
  filterPageDTO?: {pageSize?: number | null, pageNumber?: number | null, numberOfRecords?: number | null};
  terminationDateFrom: string | null;
  terminationDateTo: string | null;
  terminationRecordedOnFrom: string | null;
  terminationRecordedOnTo: string | null;
  retrievedOnFrom: string | null;
  retrievedOnTo: string | null;
  ba: boolean[] | null;
}
