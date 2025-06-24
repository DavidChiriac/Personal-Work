export class ProductsMappingFilters {
  [key: string]: any;

  //multiselect filters
  validationStatus!: string[];
  selectedStatus!: string[] | null;

  sourceSystemDesc!: string[];
  selectedSourceSystems!: string[];

  //input filters
  itemCode!: string | null;
  itemName!: string | null;
  globalCategoryName!: string | null;
  globalCategoryCode!: string | null;
  globalGroupName!: string | null;
  globalGroupCode!: string | null;
  globalSubgroupName!: string | null;
  globalSubgroupCode!: string | null;
  localCategoryName!: string | null;
  localCategoryCode!: string | null;
  localGroupName!: string | null;
  localGroupCode!: string | null;
  localSubgroupName!: string | null;
  localSubgroupCode!: string | null;
  invalidityReasonTypes!: string[] | null;
  invalidityReasonMessage!: string | null;
  proposedCategoryName!: string | null;
  proposedCategoryCode!: string | null;
  proposedGroupName!: string | null;
  proposedGroupCode!: string | null;
  proposedSubgroupName!: string | null;
  proposedSubgroupCode!: string | null;
  comment!: string | null;
  retrievedOn!: string | null;
  lastUpdatedAt!: string | null;
  lastUpdatedBy!: string | null;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.validationStatus = [];
    this.sourceSystemDesc = [];

    this.emptyFilters();
  }

  emptyFilters(): void {
    this.itemCode = null;
    this.itemName = null;
    this.globalCategoryName = null;
    this.globalCategoryCode = null;
    this.globalGroupName = null;
    this.globalGroupCode = null;
    this.globalSubgroupName = null;
    this.globalSubgroupCode = null;
    this.localCategoryName = null;
    this.localCategoryCode = null;
    this.localGroupName = null;
    this.localGroupCode = null;
    this.localSubgroupName = null;
    this.localSubgroupCode = null;
    this.invalidityReasonMessage = null;
    this.invalidityReasonTypes = null;
    this.proposedCategoryName = null;
    this.proposedCategoryCode = null;
    this.proposedGroupName = null;
    this.proposedGroupCode = null;
    this.proposedSubgroupName = null;
    this.proposedSubgroupCode = null;
    this.comment = null;
    this.retrievedOn = null;
    this.lastUpdatedAt = null;
    this.lastUpdatedBy = null;
    this.selectedSourceSystems = [];
    this.selectedStatus = [];
  }

  filtersAreEmpty(): boolean{
    return !this.itemCode &&
    !this.itemName &&
    !this.globalCategoryName &&
    !this.globalCategoryCode &&
    !this.globalGroupName &&
    !this.globalGroupCode &&
    !this.globalSubgroupName &&
    !this.globalSubgroupCode &&
    !this.localCategoryName &&
    !this.localCategoryCode &&
    !this.localGroupName &&
    !this.localGroupCode &&
    !this.localSubgroupName &&
    !this.localSubgroupCode &&
    !this.invalidityReasonMessage &&
    !this.proposedCategoryName &&
    !this.proposedCategoryCode &&
    !this.proposedGroupName &&
    !this.proposedGroupCode &&
    !this.proposedSubgroupName &&
    !this.proposedSubgroupCode &&
    !this.comment &&
    !this.retrievedOn &&
    !this.lastUpdatedAt &&
    !this.lastUpdatedBy &&
    !(this.selectedSourceSystems && this.selectedSourceSystems.length > 0) &&
    !(this.selectedStatus && this.selectedStatus.length > 0);
  }
}
