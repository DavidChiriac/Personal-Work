import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ICategoryDto,
  ICfinByCategoryDto,
  IFilters,
} from './support-tables/models/cfinByCategoryDto.interface';
import { ICfinByPos } from './support-tables/models/pos.interface';
import { ICfinCodeColumn } from './support-tables/models/cfinCodesColumn.interface';
import {
  ISystemDuplicate,
  ISystemDuplicatesFilters,
  ISystemDuplicatesRequestParams,
} from './system-duplicates/models/system-duplicates-interfaces';
import { SystemDuplicatesFilters } from './system-duplicates/models/system-duplicates-filters';
import { CentralRepositoryFilters } from '../central-repository/central-repository-table/models/central-repository-table-filters';
import { environment } from '../../../environments/environment';
import { TableFiltersUtils } from '../../shared/utils/table-filters-utils';
import { SortDirectionEnum } from '../../shared/utils/sort-directions';

@Injectable({
  providedIn: 'root',
})
export class SupportTablesService {
  apiUrl = environment.apiUrl + '/api/vcm/';

  constructor(private readonly http: HttpClient) {}

  getCfinByCategoryTableData(
    requestParams: ICategoryDto & Partial<IFilters>
  ): Observable<ICfinByCategoryDto> {
    const defaultParams = {
      fieldToSort: 'cfinCount',
      sortDirection: SortDirectionEnum.ASC,
    };

    const params = this.createParams(defaultParams, requestParams);

    return this.http.get<ICfinByCategoryDto>(
      this.apiUrl + 'support-table/get-cfins',
      { params: params }
    );
  }

  getPosCustomersCodesTableData(
    requestParams: ICfinCodeColumn & Partial<IFilters>
  ): Observable<ICfinByPos> {
    const defaultParams = {
      fieldToSort: 'cfinCode',
      sortDirection: SortDirectionEnum.ASC,
    };

    const params = this.createParams(defaultParams, requestParams);

    return this.http.get<ICfinByPos>(
      this.apiUrl + 'support-table/get-pos',
      {
        params: params,
      }
    );
  }

  get92CfinCodesTableData(
    requestParams: ICfinCodeColumn & Partial<IFilters>
  ): Observable<ICfinByPos> {
    const defaultParams = {
      fieldToSort: 'cfinCode',
      sortDirection: SortDirectionEnum.ASC,
    };

    const params = this.createParams(defaultParams, requestParams);

    return this.http.get<ICfinByPos>(
      this.apiUrl + 'support-table/get-cat-92',
      {
        params: params,
      }
    );
  }

  get98CfinCodesTableData(
    requestParams: ICfinCodeColumn & Partial<IFilters>
  ): Observable<ICfinByPos> {
    const defaultParams = {
      fieldToSort: 'cfinCode',
      sortDirection: SortDirectionEnum.ASC,
    };

    const params = this.createParams(defaultParams, requestParams);

    return this.http.get<ICfinByPos>(
      this.apiUrl + 'support-table/get-cat-98',
      {
        params: params,
      }
    );
  }

  getSystemDuplicatesFilters(): Observable<SystemDuplicatesFilters> {
    return this.http.get<SystemDuplicatesFilters>(this.apiUrl + 'support-table/filters');
  }

  getSystemDuplicatesData(
    reqParams: Partial<ISystemDuplicatesRequestParams & ISystemDuplicatesFilters>
  ): Observable<{systemDuplicateDTOs: ISystemDuplicate[], filters: {numberOfRecords: number}}> {
    return this.http.post<{systemDuplicateDTOs: ISystemDuplicate[], filters: {numberOfRecords: number}}>(
      this.apiUrl + 'support-table/system-duplicates',
      reqParams
    );
  }

  exportSystemDuplicatesData(
    requestParams: ISystemDuplicatesRequestParams
  ): Observable<HttpResponse<object>> {
    return this.http.post<Blob>(
      this.apiUrl + 'support-table/export',
      requestParams,
      {
        observe: 'response',
        responseType: 'blob' as 'json',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  deleteSystemDuplicateRecord(id: string): Observable<void> {
    return this.http.delete<void>(
      this.apiUrl + 'support-table/system-duplicate',
      { params: { id } }
    );
  }

  createParams(
    defaultParams: Partial<IFilters>,
    requestParams:
      | (ICfinCodeColumn & Partial<IFilters>)
      | (ICategoryDto & Partial<IFilters>)
  ): HttpParams {
    let params = new HttpParams();

    const effectiveParams = {
      ...requestParams,
      fieldToSort: requestParams.fieldToSort ?? defaultParams.fieldToSort,
      sortDirection: requestParams.sortDirection ?? defaultParams.sortDirection,
    };

    Object.entries(effectiveParams).forEach(([key, value]) => {
      if (value) {
        params = params.append(key, value);
      }
    });

    return params;
  }

  createSystemDuplicatesFilters(
    filters: Partial<CentralRepositoryFilters>
  ): SystemDuplicatesFilters {
    const newFilters: SystemDuplicatesFilters = new SystemDuplicatesFilters();

    newFilters.origin = TableFiltersUtils.convertToMultiselectOption(
      filters['origins']
    );
    newFilters.vendor = TableFiltersUtils.convertToMultiselectOption(
      filters['vendorCodes']
    );
    newFilters.customer = TableFiltersUtils.convertToMultiselectOption(
      filters['customerCodes']
    );
    newFilters.category = TableFiltersUtils.convertToMultiselectOption(
      filters['categories']
    );
    newFilters.oneTimeAcc = TableFiltersUtils.convertToMultiselectOption(
      filters['oneTimeAccounts']
    );
    newFilters.accountGroup = TableFiltersUtils.convertToMultiselectOption(
      filters['accountGroups']
    );
    newFilters.bpGrouping = TableFiltersUtils.convertToMultiselectOption(
      filters['bpGroupings']
    );

    return newFilters;
  }
}
