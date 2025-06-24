export interface ILeaverReportAcknowledgement {
    id: number,
    taskTitle: string,
    week: {weekNumber: string, retrievedOnFrom: string, retrievedOnTo: string},
    weekNumber: string;
    retrievedOnFrom: string;
    retrievedOnTo: string;
    createdOn: string,
    assignee: string,
    email: string,
    taskDescription: string,
    acknowledged: number | null,
    acknowledgedBy: string,
    acknowledgedOn: string,
    _selected?: boolean,
    periodStart?: string,
    periodEnd?: string,
    status?: number
};

export interface ILeaverReportAcknowledgementResponseFilters{
    taskFilterValuesDTO: {
        status: number[];
    }
    taskCountDTO: {
        pendingTasks: number;
        completedTasks: number;
        allTasks: number;
    }
}

export interface ILeaverReportAcknowledgementFilters {
  weekFrom: string | null;
  weekTo: string | null;
  taskTitle: string | null;
  id: number | null;
  createdOnFrom: string | null;
  createdOnTo: string | null;
  assignee: string | null;
  taskDescription: string | null;
  status: number[] | null;
  acknowledgedBy: string | null;
  acknowledgedOnFrom: string | null;
  acknowledgedOnTo: string | null;

  filterPageDTO: {
    pageSize: number | null;
    pageNumber: number | null;
  };
}
