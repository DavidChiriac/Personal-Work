import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILeaversKpis } from './models/leavers-kpi.interface';
import { environment } from '../../../environments/environment';
import { ITask } from './models/tasks.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl = environment.apiUrl + '/api/leavers/dashboard/';

  constructor(private readonly http: HttpClient) { }

  getDashboardData(): Observable<ILeaversKpis>{
    return this.http.get<ILeaversKpis>(this.apiUrl + 'metrics');
  }

  getTasks(): Observable<{userPendingTasks: ITask[]}>{
    return this.http.get<{userPendingTasks: ITask[]}>(this.apiUrl + 'pending-tasks');
  }
}
