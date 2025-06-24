import { Component, OnInit } from '@angular/core';
import { IProject } from '../shared/interfaces/project.interface';
import { ProjectTemplateComponent } from './project-template/project-template.component';
import { DeviceService } from '../shared/services/device.service';
import { CommonModule } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProjectsService } from './projects.service';
import { SessionStorageService } from 'ngx-webstorage';
import { environment } from '../../environments/environment';

@UntilDestroy()
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
    private readonly deviceService: DeviceService,
    private readonly sessionStorageService: SessionStorageService
  ) {
    this.isMobile = deviceService.isMobile();
  }

  ngOnInit(): void {
    const cachedProjects = this.sessionStorageService.retrieve('projects');

    if (cachedProjects) {
      this.projects = [...cachedProjects];
    } else {
      this.getProjects();
    }
  }

  getProjects(): void {
    this.projectsService
      .getProjects()
      .pipe(untilDestroyed(this))
      .subscribe((projects) => {
        this.projects = [
          ...projects.data.map((project) => {
            return {
              ...project,
              imageUrl:
                (environment.prod ? '' : environment.apiUrl) +
                project.image?.url,
              presentationImagesUrl: project.presentationImages?.map(
                (image) =>
                  (environment.prod ? '' : environment.apiUrl) + image.url
              ),
            };
          }),
        ];

        this.sessionStorageService.store('projects', this.projects);
      });
  }
}
