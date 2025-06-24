export class LeaverReportAcknowledgementFilters {
  [key: string]: any;

  acknowledged!: number[] | null;
  selectedAcknowledged!: number[] | null;

  taskTitle!: string | null;
  createdOn!: string[] | null;
  createdOnFrom!: string | null;
  createdOnTo!: string | null;
  week!: string[] | null;
  weekFrom!: string | null;
  weekTo!: string | null;
  assignee!: string | null;
  taskDescription!: string | null;
  acknowledgedBy!: string | null;
  acknowledgedOn!: string | null;
  acknowledgedOnFrom!: string | null;
  acknowledgedOnTo!: string | null;

  status?: number[] | null;

  filterPageDTO!: {
    numberOfRecords: number | null;
  };

  constructor() {
    this.reset();
  }

  reset(): void {
    this.week = [];
    this.acknowledged = [];

    this.emptyFilters();
  }

  emptyFilters(): void {
    this.selectedAcknowledged = null;
    this.taskTitle = null;
    this.createdOn = null;
    this.createdOnFrom = null;
    this.createdOnTo = null;
    this.week = null;
    this.weekFrom = null;
    this.weekTo = null;
    this.assignee = null;
    this.taskDescription = null;
    this.acknowledgedBy = null;
    this.acknowledgedOn = null;
    this.acknowledgedOnFrom = null;
    this.acknowledgedOnTo = null;

    this.filterPageDTO = {
      numberOfRecords: null
    };
  }

  filtersAreEmpty(): boolean {
    return (
      (!this.selectedAcknowledged || this.selectedAcknowledged.length === 0) &&
      !this.createdOn &&
      !this.week &&
      !this.assignee &&
      !this.taskTitle &&
      !this.taskDescription &&
      !this.acknowledgedBy &&
      !this.acknowledgedOn
    );
  }
}
