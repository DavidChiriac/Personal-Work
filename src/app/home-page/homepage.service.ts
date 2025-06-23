import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as qs from 'qs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomepageService {
  constructor(private http: HttpClient) {}

  getHomepage(): Observable<{
    data: { header: string; description: string; image: { url: string } };
  }> {
    const query = qs.stringify(
      {
        populate: ['image'],
      },
      {
        encodeValuesOnly: true,
      }
    );
    return this.http.get<{
      data: { header: string; description: string; image: { url: string } };
    }>(environment.apiUrl + `homepage?${query}`);
  }
}
