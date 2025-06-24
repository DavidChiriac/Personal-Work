import { EventEmitter, Injectable } from '@angular/core';
import { IVendor } from '../../shared/interfaces/Vendor.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IVendorCustomerRequestParams } from './central-repository-table/models/central-repository-table.interface';
import { ICfinOptions } from '../../shared/interfaces/CfinOptions.interface';
import { SessionStorageService } from 'ngx-webstorage';
import { TableFiltersUtils } from '../../shared/utils/table-filters-utils';
import { CentralRepositoryFilters } from './central-repository-table/models/central-repository-table-filters';

@Injectable({
  providedIn: 'root',
})
export class CentralRepositoryService {
  recordViewClearFilters = new EventEmitter();
  apiUrl = environment.apiUrl + '/api/vcm/';

  constructor(
    private readonly http: HttpClient,
    private readonly ssService: SessionStorageService
  ) {}

  getVendorCustomerData(
    requestParams: IVendorCustomerRequestParams
  ): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + 'central-data-api/get-all',
      requestParams,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  getVendorCustomerDataFilters(): Observable<IVendorCustomerRequestParams> {
    return this.http.get<IVendorCustomerRequestParams>(
      this.apiUrl + 'central-data-api/get-filters',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  selectAllVendorsCustomerRows(
    requestParams: IVendorCustomerRequestParams
  ): Observable<{id: string, status: string, cfinCode: number, category: string, bpGrouping: string, accountGroup: string}[]> {
    return this.http.post<{id: string, status: string, cfinCode: number, category: string, bpGrouping: string, accountGroup: string}[]>(
      this.apiUrl + 'central-data-api/select-all',
      requestParams,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  exportVendorsCustomerData(
    requestParams: any
  ): Observable<HttpResponse<object>> {
    return this.http.post<Blob>(
      this.apiUrl + 'central-data-api/export',
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

  exportCfinData(selectedRowIds: string[]): Observable<HttpResponse<object>> {
    return this.http.post<Blob>(
      this.apiUrl + 'central-data-api/export-cfin',
      selectedRowIds,
      {
        observe: 'response',
        responseType: 'blob' as 'json',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  deleteRecord(id: string): Observable<void> {
    return this.http.delete<void>(
      this.apiUrl + 'vendor-customer/delete',
      { params: { id: parseInt(RegExp(/\d+/).exec(id.toString())?.[0] ?? '') } }
    );
  }

  getVendor(id: string): Observable<IVendor> {
    return this.http.get<IVendor>(
      this.apiUrl + 'central-data-api/get/' + id
    );
  }

  getDuplicates(id: string, filters?: Partial<IVendorCustomerRequestParams & CentralRepositoryFilters>): Observable<IVendor[]> {
    let reqFilters;
    if(filters){
      reqFilters = filters;
    }

    return this.http.post<IVendor[]>(
      this.apiUrl + 'vendor-customer/get-related-records',
      reqFilters,
      {
        params: { id }
      }
    );
  }

  saveChanges(editedRecord: Partial<IVendor>): Observable<IVendor> {
    return this.http.put<IVendor>(this.apiUrl + 'vendor-customer/edit', {
      ...editedRecord,
    });
  }

  getCfinCode(category: string, cfinStart?: number): Observable<number> {
    let params = new HttpParams();
    params = params.append('category', category);
    if (cfinStart) {
      params = params.append('cfinStart', cfinStart);
    }
    return this.http.get<number>(
      this.apiUrl + 'vendor-customer/generate-cfin',
      {
        params: params,
      }
    );
  }

  getCfinOptions(): Observable<ICfinOptions[]> {
    return this.http.get<ICfinOptions[]>('/assets/cfinOptions.json');
  }

  getNextRecord(id: string, currentField: string): Observable<string> {
    return this.http.post(
      this.apiUrl + 'vendor-customer/get-next-record',
      { ...this.ssService.retrieve('filters'), currentValue: currentField },
      { params: { id: id }, responseType: 'text' }
    );
  }

  getPreviousRecord(id: string, currentField: string): Observable<string> {
    return this.http.post(
      this.apiUrl + 'vendor-customer/get-previous-record',
      { ...this.ssService.retrieve('filters'), currentValue: currentField },
      { params: { id: id }, responseType: 'text' },
    );
  }

  getCategoryGroupMatching(
    category?: string,
    bpGrouping?: string,
    accountGroup?: string
  ): Observable<(IVendor & { cfinStart: number })[]> {
    let params = {};
    if (category) {
      params = { ...params, category: category };
    }
    if (bpGrouping) {
      params = { ...params, bpGrouping: bpGrouping };
    }
    if (accountGroup) {
      params = { ...params, accountGroup: accountGroup };
    }

    return this.http.get<(IVendor & { cfinStart: number })[]>(
      this.apiUrl + 'vendor-customer/get-category-group-mapping',
    { params: params }
    );
  }

  massApprove(selectedRowIds: string[], approveComment: string): Observable<void> {
    return this.http.patch<void>(this.apiUrl + 'vendor-customer/approval', {ids: selectedRowIds, comment: approveComment});
  }

  massDelete(selectedRowIds: string[]): Observable<void> {
    return this.http.delete<void>(this.apiUrl + 'vendor-customer/mass', {body: selectedRowIds?.map(id => parseInt(RegExp(/\d+/).exec(id.toString())?.[0] ?? ''))});
  }

  createFilters(filters: CentralRepositoryFilters): CentralRepositoryFilters {
    const newFilters: CentralRepositoryFilters = new CentralRepositoryFilters();

    newFilters.status = TableFiltersUtils.convertToMultiselectOption(
      filters['statuses']
    );
    newFilters.matching = TableFiltersUtils.convertToMultiselectOption(
      filters['matchings']
    );
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
    newFilters.bpGrouping = TableFiltersUtils.convertToMultiselectOption(
      filters['bpGroupings']
    );
    newFilters.oneTimeAcc = TableFiltersUtils.convertToMultiselectOption(
      filters['oneTimeAccounts']
    );
    newFilters.accountGroup =
      TableFiltersUtils.convertToMultiselectOption(filters['accountGroups']);

    return newFilters;
  }
}
