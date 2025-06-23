import { Injectable } from '@angular/core';
import { IProject } from '../interfaces/project.interface';
import projects from '../../../assets/data/projects.json';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  getProjects(): IProject[] {
    return projects.projects;
  }

  getSingleProject(slug: string): IProject {
    return projects.projects.find(
      (project) => project.slug === slug
    ) as IProject;
  }
}
