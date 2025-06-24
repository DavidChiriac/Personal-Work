import { IColumn } from '../../../shared/interfaces/column.interface';

export class GlobalHierarchiesColumns {
  [key: string]: any;

  private static columns: IColumn[];

  static getColumns(): IColumn[] {
    this.columns = [
      {
        field: 'globalCategoryName',
        header: 'Category'
      },
      {
        field: 'globalGroupName',
        header: 'Group'
      },
      {
        field: 'globalSubgroupName',
        header: 'Subgroup'
      },
    ];

    return this.columns;
  }
}
