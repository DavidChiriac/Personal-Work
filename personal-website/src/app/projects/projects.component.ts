import { Component } from '@angular/core';
import { IProject } from '../shared/interfaces/project.interface';
import { ProjectTemplateComponent } from './project-template/project-template.component';
@Component({
  selector: 'app-projects',
  imports: [ProjectTemplateComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  projects: IProject[] = [];
}
