import { Component, OnInit } from '@angular/core';
import { IProject } from '../shared/interfaces/project.interface';
import { ProjectTemplateComponent } from './project-template/project-template.component';
import { ProjectsService } from '../shared/services/projects.service';
import { DeviceService } from '../shared/services/device.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-projects',
  imports: [CommonModule, ProjectTemplateComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  projects: IProject[] = [];

  isMobile!: boolean;

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly deviceService: DeviceService
  ) {
    this.isMobile = deviceService.isMobile();
  }

  ngOnInit(): void {
    this.projects = this.projectsService.getProjects();
  }
}
