import { SortDirectionEnum } from '../../../shared/utils/sort-directions';

export interface INotificationsFilters {
  pageSize: number;
  pageNumber: number;
  fieldToSort?: string;
  sortDirection?: SortDirectionEnum;
}
