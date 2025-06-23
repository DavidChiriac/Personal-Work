import { Component, OnInit } from '@angular/core';
import { IProject } from '../shared/interfaces/project.interface';
import { ProjectTemplateComponent } from './project-template/project-template.component';
import { ProjectsService } from '../shared/services/projects.service';
@Component({
  selector: 'app-projects',
  imports: [ProjectTemplateComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  projects: IProject[] = [];

  constructor(private readonly projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.projects = this.projectsService.getProjects();
  }
}
