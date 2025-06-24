import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IGroupSourceSystemMappingDTO } from './models/groupSourceSystemMappingDTO.interface';
import { Table } from 'primeng/table';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiUrl = environment.apiUrl + '/api/';

  constructor(private readonly http: HttpClient) { }

  getGroupSourceSystemMappings(): Observable<IGroupSourceSystemMappingDTO[]> {
    return this.http.get<IGroupSourceSystemMappingDTO[]>(this.apiUrl + 'group-access/grid');
  }

  createGroupAccessMapping(groupAccess: IGroupSourceSystemMappingDTO): Observable<IGroupSourceSystemMappingDTO> {
    return this.http.post<IGroupSourceSystemMappingDTO>(this.apiUrl + 'group-access', {groupId: groupAccess.group?.id, sourceSystemId: groupAccess.sourceSystem?.id});
  }

  updateGroupAccessMapping(groupAccess: IGroupSourceSystemMappingDTO): Observable<IGroupSourceSystemMappingDTO> {
    const body = groupAccess;
    delete body.createdBy;
    delete body.createdDate;
    delete body.lastUpdatedBy;
    delete body.lastUpdatedDate;

    return this.http.put<IGroupSourceSystemMappingDTO>(this.apiUrl + `group-access/${groupAccess.id}`, {...body});
  }

  getSourceSystems(): Observable<{id: number, name: string}[]> {
    return this.http.get<{id: number, name: string}[]>(this.apiUrl + 'source-systems');
  }

  checkEmptyFilters(table: Table): boolean {
    let filtersApplied = 0;
    if(table.filters){
      Object.keys(table.filters).forEach((key) => {
        if(Array.isArray(table.filters[key])){
          if(table.filters[key][0].value && table.filters[key][0].value.length >= 0){
            filtersApplied += 1;
          }
        } else if(table.filters[key].value && table.filters[key].value.length >= 0){
          filtersApplied += 1;
        }
      });
    }
    return filtersApplied === 0;
  }
}
