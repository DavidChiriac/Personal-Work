import { codeNameAttribute } from '../../products-mapping/models/products-mapping-table.interface';

export class GlobalHierarchiesFilters {
  [key: string]: any;

  globalCategoryName!: codeNameAttribute[];
  globalGroupName!: codeNameAttribute[];
  globalSubgroupName!: codeNameAttribute[];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.globalCategoryName = [];
    this.globalGroupName = [];
    this.globalSubgroupName = [];
  }
}
