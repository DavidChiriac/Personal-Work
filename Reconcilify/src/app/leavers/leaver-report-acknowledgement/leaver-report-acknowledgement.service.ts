import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IExtendedFilterPageDTO } from '../../hierarchy-mapper/products-mapping/models/products-mapping-table.interface';
import { ILeaverReportAcknowledgement, ILeaverReportAcknowledgementFilters, ILeaverReportAcknowledgementResponseFilters } from './models/leaver-report-acknowledgement.interface';
import { LeaverReportAcknowledgementFilters } from './models/leaver-report-acknowledgement-table.filters';
import { IRequestParams } from '../../shared/interfaces/request-params.interface';

@Injectable({
  providedIn: 'root'
})
export class LeaverReportAcknowledgementService {
  apiUrl = environment.apiUrl + '/api/leavers/tasks';

  constructor(private readonly http: HttpClient) { }

  globalSearch(globalSearchTerm: string, pageSize: number, pageNumber: number): Observable<{ userAcknowledgementTaskViewDTOList: ILeaverReportAcknowledgement[]; extendedFilterPageDTO: Partial<IExtendedFilterPageDTO> }> {
    return this.http.get<{ userAcknowledgementTaskViewDTOList: ILeaverReportAcknowledgement[]; extendedFilterPageDTO: Partial<IExtendedFilterPageDTO> }>(
      this.apiUrl + '/global-search', {params: {globalSearchTerm: globalSearchTerm, pageSize: pageSize, pageNumber: pageNumber}}
    );
  }

  getTableData(
    params: Partial<IRequestParams> & Partial<LeaverReportAcknowledgementFilters>,
    status: number[] | null
  ): Observable<{ userAcknowledgementTaskViewDTO: ILeaverReportAcknowledgement[]; taskFilterDTO: Partial<LeaverReportAcknowledgementFilters> }> {
    const body = this.buildBody(params, status);
    return this.http.post<{ userAcknowledgementTaskViewDTO: ILeaverReportAcknowledgement[]; taskFilterDTO: LeaverReportAcknowledgementFilters }>(
      this.apiUrl,
      { ...body }
    );
  }

  selectAll(
    params: Partial<IRequestParams> & Partial<LeaverReportAcknowledgementFilters>,
    status: number[] | null
  ): Observable<number[]> {
    const body = this.buildBody(params, status);

    const hasNonFalsyValue = (obj: Partial<ILeaverReportAcknowledgementFilters>): boolean => {
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
      hasValue ? { ...body } : null
    );
  }

  exportTableData(
    params: Partial<IRequestParams> & Partial<LeaverReportAcknowledgementFilters>,
    status: number[] | null,
    selectedItems: Partial<ILeaverReportAcknowledgement>[] | null = null
  ): Observable<HttpResponse<object>> {
    const body = this.buildBody(params, status);

    return this.http.post<Blob>(
      this.apiUrl + '/export',
      {
        taskFilterDTO: { ...body },
        selectedTaskIds: selectedItems?.map((item) => item.id),
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

  getFilters(): Observable<ILeaverReportAcknowledgementResponseFilters> {
    return this.http.get<ILeaverReportAcknowledgementResponseFilters>(
      this.apiUrl + '/filters'
    );
  }

  acknowledgeTask(task: ILeaverReportAcknowledgement): Observable<ILeaverReportAcknowledgement> {
    return this.http.patch<ILeaverReportAcknowledgement>(this.apiUrl + `/${task.id}`, {}, {params: {status: 2}});
  }

  buildBody(params: Partial<IRequestParams> & Partial<LeaverReportAcknowledgementFilters>, status?: number[] | null): Partial<ILeaverReportAcknowledgementFilters> {
    const body: {[key: string]: any} = {
      ...params,
      taskTitle: params.taskTitle,
      periodStart: params.weekFrom,
      periodEnd: params.weekTo,
      createdOnFrom: params.createdOnFrom,
      createdOnTo: params.createdOnTo,
      assignee: params.assignee,
      taskDescription: params.taskDescription,
      status: status,
      filterPageDTO: {
        pageSize: params.pageSize ?? 50,
        pageNumber: params.pageNumber ?? 0
      }
    };

    delete body['selectedAcknowledged'];
    delete body['acknowledged'];
    delete body['acknowledgedOn'];
    delete body['createdOn'];
    delete body['pageNumber'];
    delete body['pageSize'];
    delete body['week'];
    delete body['weekFrom'];
    delete body['weekTo'];

    Object.entries(body).forEach(([key, value]) => {
      if(!value) {
        delete body[key];
      }
    });
    
    return body;
  }
}
