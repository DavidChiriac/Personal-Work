import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserGuideEnum } from '../utils/user-guide-enum';
import { DatePipe } from '@angular/common';
import { IGroupDTO } from '../../administration/group-management/models/groupDTO.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  tasksSidebarVisible$ = new BehaviorSubject(false);

  constructor(private readonly http: HttpClient, private readonly datePipe: DatePipe) { }

  getAppVersion(): Observable<string> {
    return this.http.get<{ app: { version: string } }>(environment.apiUrl + '/management/info')
      .pipe(
        map(response => `Version ${response.app.version}`)
      );
  }
  
  getReconUserGuide(module: string): void {
    const fileUrl = environment.apiUrl + '/api/docs/' + UserGuideEnum[module as keyof typeof UserGuideEnum];
    window.open(fileUrl, '_blank');
  }

  
  formatDateFilters(date: string | number): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }
  
  getGroups(module?: string): Observable<IGroupDTO[]> {
    let params = new HttpParams();
    if(module){
      params = params.append('module', module);
    }
    return this.http.get<IGroupDTO[]>(environment.apiUrl + '/api/group-management/grid', {params});
  }
}
