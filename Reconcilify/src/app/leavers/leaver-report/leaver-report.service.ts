import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IExtendedFilterPageDTO } from '../../hierarchy-mapper/products-mapping/models/products-mapping-table.interface';
import { ILeaverReport, ILeaverReportFilters, ILeaverReportResponseFilters } from './models/leaver-report.interface';
import { LeaverReportFilters } from './models/leaver-report-table.filters';
import { IRequestParams } from '../../shared/interfaces/request-params.interface';

@Injectable({
  providedIn: 'root'
})
export class LeaverReportService {
  apiUrl = environment.apiUrl + '/api/leavers';

  constructor(private readonly http: HttpClient) { }

  globalSearch(globalSearchTerm: string, pageSize: number, pageNumber: number): Observable<{ leavers: ILeaverReport[]; pagination: Partial<IExtendedFilterPageDTO> }> {
    return this.http.get<{ leavers: ILeaverReport[]; pagination: Partial<IExtendedFilterPageDTO> }>(
      this.apiUrl + '/global-search', {params: {globalSearchTerm: globalSearchTerm, pageSize: pageSize, pageNumber: pageNumber}}
    );
  }

  getTableData(
    params: Partial<IRequestParams> & Partial<LeaverReportFilters>
  ): Observable<{ leavers: ILeaverReport[]; leaverFilterCriteria: Partial<LeaverReportFilters> }> {
    const body = this.buildBody(params);

    return this.http.post<{ leavers: ILeaverReport[]; leaverFilterCriteria: LeaverReportFilters }>(
      this.apiUrl,
      { ...body }
    );
  }

  selectAll(
    params: Partial<IRequestParams> & Partial<LeaverReportFilters>
  ): Observable<number[]> {
    const body = this.buildBody(params);

    const hasNonFalsyValue = (obj: Partial<LeaverReportFilters>): boolean => {
      return Object.values(obj).some((value) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return Boolean(value);
      });
    };

    const hasValue = hasNonFalsyValue(body);

    return this.http.post<number[]>(
      this.apiUrl + '/select-all',
      hasValue ? { ...body} : null
    );
  }

  exportTableData(
    params: Partial<IRequestParams> & Partial<LeaverReportFilters>,
    selectedItems: Partial<ILeaverReport>[] | null = null
  ): Observable<HttpResponse<object>> {
    const body = this.buildBody(params);

    return this.http.post<Blob>(
      this.apiUrl + '/export',
      {
        leaversFilterCriteriaDTO: { ...body },
        selectedLeaverIds: selectedItems?.map((item) => item.id),
      },
      {
        observe: 'response',
        responseType: 'blob' as 'json',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  getFilters(): Observable<ILeaverReportResponseFilters> {
    return this.http.get<ILeaverReportResponseFilters>(
      this.apiUrl + '/filters'
    );
  }

  buildBody(params: Partial<IRequestParams> & Partial<LeaverReportFilters>): Partial<ILeaverReportFilters> {
    const body: {[key: string]: any} = {
      ...params,
      systemNames: params.selectedSourceSystem,
      backdatedLeaverValues: params.selectedBackdatedLeaver,
      filterPageDTO: {
        pageSize: params.pageSize ?? 50,
        pageNumber: params.pageNumber ?? 0
      }
    };
    
    delete body['sourceSystemName'];
    delete body['selectedSourceSystem'];
    delete body['retrievedOn'];
    delete body['terminationDate'];
    delete body['terminationRecordedOn'];
    delete body['pageSize'];
    delete body['pageNumber'];
    delete body['selectedBackdatedLeaver'];

    Object.entries(body).forEach(([key, value]) => {
      if(!value || (Array.isArray(value) && value.length === 0)) {
        delete body[key];
      }
    });
    
    return body;
  }
}
