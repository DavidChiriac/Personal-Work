import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGlobalHierarchies, IGlobalHierarchiesTableFilters } from './models/global-hierarchies.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalHierarchiesService {
  apiUrl = environment.apiUrl + '/api/ghm/global-hierarchies';

  constructor(private readonly http: HttpClient) { }

  getGlobalHierarchies(): Observable<IGlobalHierarchies[]> {
    return this.http.get<IGlobalHierarchies[]>(this.apiUrl);
  }

  exportTableData(filters: IGlobalHierarchiesTableFilters): Observable<HttpResponse<object>> {
    const body = {
      globalCategoryName: filters.selectedCategory.map(category => category.name),
      globalCategoryCode: filters.selectedCategory.map(category => category.code),
      globalGroupName: filters.selectedGroup.map(group => group.name),
      globalGroupCode: filters.selectedGroup.map(group => group.code),
      globalSubgroupName: filters.selectedSubgroup.map(subgroup => subgroup.name),
      globalSubgroupCode: filters.selectedSubgroup.map(subgroup => subgroup.code)
    };
    return this.http.post<Blob>(this.apiUrl + '/export', {...body}, {
      observe: 'response',
      responseType: 'blob' as 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
