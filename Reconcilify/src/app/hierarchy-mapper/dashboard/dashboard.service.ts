import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ISystemMetrics } from '../models/system-metrics.interface';

@Injectable({
  providedIn: 'root'
})
export class FnBDashboardService {
  apiUrl = environment.apiUrl + '/api/ghm/';

  constructor(private readonly httpClient: HttpClient) { }

  getDashboardData(): Observable<{systemMetrics: ISystemMetrics[]}>{
    return this.httpClient.get<{systemMetrics: ISystemMetrics[]}>(this.apiUrl + 'dashboard');
  }
}
