export class CategoryFilters {
  [key: string]: any;

  //multiselect filters
  categories!: string[];
  selectedCategories!: string[];
  

  //input filters
  countCfin!: number | null;
  minCfin!: number | null;
  maxCfin!: number | null;
  nextAvailableCfin!: number | null;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.categories = [];
    this.selectedCategories = [];

    this.countCfin = null;
    this.minCfin = null;
    this.maxCfin = null;
    this.nextAvailableCfin = null;
  }

  deleteUnusedFilters(filters: any): any {
    delete filters.selectedCategories;
  }
}
