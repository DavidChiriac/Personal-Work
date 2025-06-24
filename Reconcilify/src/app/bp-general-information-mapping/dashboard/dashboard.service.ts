import { HttpClient, HttpResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVendorCustomerSummary } from './vendor-customer-summary/models/vendor-customer-summary.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  uploadFinished = new EventEmitter<void>();
  apiUrl = environment.apiUrl + '/api/vcm/';

  constructor(private readonly http: HttpClient) {}

  downloadTemplate(): Observable<HttpResponse<object>> {
    return this.http.get<Blob>(this.apiUrl + 'data/download-template', {
      observe: 'response',
      responseType: 'blob' as 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getSummaryData(): Observable<IVendorCustomerSummary[]> {
    return this.http.get<IVendorCustomerSummary[]>(
      this.apiUrl + 'dashboard/aggregations'
    );
  }

  uploadVendorCustomersFile(fileForm: FormData): Observable<FormData> {
    return this.http.post<FormData>(
      this.apiUrl + 'data/upload',
      fileForm
    );
  }
}
