import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProject } from '../shared/interfaces/project.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private readonly http: HttpClient) {}

  getProjects(): Observable<{ data: IProject[] }> {
    return this.http.get<{ data: IProject[] }>(
      environment.apiUrl + `/api/projects?populate=*`
    );
  }

  getSingleProject(slug: string): Observable<{ data: IProject[] }> {
    return this.http.get<{ data: IProject[] }>(
      environment.apiUrl + `/api/projects?filters[slug][$eq]=${slug}&populate=*`
    );
  }
}
