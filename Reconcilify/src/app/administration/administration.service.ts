import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { environment } from '../../environments/environment';
import { IGroupDTO } from './group-management/models/groupDTO.interface';
import { IGroupModuleDTO } from './group-module-management/models/groupModuleDTO.interface';
import {
  IUserGroupDTO,
  IUserGroupFilters,
} from './user-group-management/models/userGroupDTO.interface';
import { IRequestParams } from '../shared/interfaces/request-params.interface';

@Injectable({
  providedIn: 'root',
})
export class AdministrationService {
  apiUrl = environment.apiUrl + '/api/';

  constructor(private readonly http: HttpClient) {}

  createGroup(group: IGroupDTO): Observable<IGroupDTO> {
    const body = { ...group };
    delete body.isEditing;
    delete body.id;
    delete body.createdDate;
    delete body.createdBy;
    delete body.lastUpdatedBy;
    delete body.lastUpdatedDate;
    delete body.isActive;

    return this.http.post<IGroupDTO>(this.apiUrl + 'group-management', {
      ...body,
    });
  }

  updateGroup(group: IGroupDTO): Observable<IGroupDTO> {
    const body = { ...group };
    delete body.isEditing;
    delete body.createdDate;
    delete body.createdBy;
    delete body.lastUpdatedBy;
    delete body.lastUpdatedDate;

    return this.http.put<IGroupDTO>(
      this.apiUrl + `group-management/${group.id}`,
      { ...body }
    );
  }

  checkEmptyFilters(table: Table): boolean {
    if (!table.filters) return true;

    return !Object.values(table.filters).some(filter => {
      const f = Array.isArray(filter) ? filter[0] : filter;
      const value = f?.value;
      return value !== null && (typeof value !== 'string' || value.trim().length > 0);
    });
  }


  getModules(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(
      this.apiUrl + 'modules'
    );
  }

  getGroupModuleMappings(): Observable<IGroupModuleDTO[]> {
    return this.http.get<IGroupModuleDTO[]>(this.apiUrl + 'group-module');
  }

  createGroupModuleMapping(
    groupModule: IGroupModuleDTO
  ): Observable<IGroupModuleDTO> {
    return this.http.post<IGroupModuleDTO>(this.apiUrl + 'group-module', {
      groupId: groupModule.group?.id,
      groupName: groupModule.group?.name,
      moduleId: groupModule.module?.id,
      moduleName: groupModule.module?.name,
    });
  }

  updateGroupModuleMapping(
    groupModule: IGroupModuleDTO
  ): Observable<IGroupModuleDTO> {
    return this.http.patch<IGroupModuleDTO>(
      this.apiUrl + `group-module/${groupModule.id}`,
      {},
      { params: { active: groupModule.isActive || false } }
    );
  }

  getUserGroupFilters(): Observable<{
    filterValues: { groupNames: string[]; status: boolean[] };
  }> {
    return this.http.get<{
      filterValues: { groupNames: string[]; status: boolean[] };
    }>(this.apiUrl + 'azure/users/filters');
  }

  getUserGroupMappings(
    filters: IUserGroupFilters & IRequestParams
  ): Observable<{ userFilterDTO: IUserGroupFilters; users: IUserGroupDTO[] }> {
    return this.http.post<{
      userFilterDTO: IUserGroupFilters;
      users: IUserGroupDTO[];
    }>(this.apiUrl + 'azure/users', {
      ...filters,
      groupName: filters.groupName,
      globalSearchTerm: filters.globalSearchInput,
    });
  }

  createUserGroupMapping(
    userGroup: Partial<IUserGroupDTO>
  ): Observable<IUserGroupDTO> {
    return this.http.post<IUserGroupDTO>(
      this.apiUrl + `azure/users/${userGroup.group?.id}/user`,
      {},
      {
        params: {
          userEmail: userGroup.email ?? '',
        },
      }
    );
  }

  deleteUserGroupMapping(userGroup: Partial<IUserGroupDTO>): Observable<void> {
    return this.http.delete<void>(
      this.apiUrl + `azure/users/${userGroup.group?.id}/user`,
      {
        params: { userEmail: userGroup.email ?? '' },
      }
    );
  }

  selectAll(filters: IUserGroupFilters): Observable<number[]> {
    return this.http.post<Partial<number>[]>(
      this.apiUrl + 'azure/users/select-all',
      {
        ...filters,
      }
    );
  }

  exportTableData(
    filters: IUserGroupFilters,
    selectedItems: Partial<IUserGroupDTO>[] | null = null
  ): Observable<HttpResponse<object>> {
    return this.http.post<Blob>(
      this.apiUrl + 'azure/users/export',
      {
        ...filters,
        selectedItemIds: selectedItems?.map((item) => item.id),
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

  globalSearch(
    globalSearchTerm: string,
    pageSize: number,
    pageNumber: number
  ): Observable<{
    userAccessAssignmentDTOS: IUserGroupDTO[];
    pagination: { numberOfRecords: number };
  }> {
    return this.http.get<{
      userAccessAssignmentDTOS: IUserGroupDTO[];
      pagination: { numberOfRecords: number };
    }>(this.apiUrl + 'azure/users/global-search', {
      params: {
        globalSearchTerm: globalSearchTerm,
        pageSize: pageSize,
        pageNumber: pageNumber,
      },
    });
  }

  adjustDateFilter(filter: string): string {
    const dateStr = filter;
    let date = '';
    if (dateStr) {
      date = new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
    }
    return date;
  }
}
