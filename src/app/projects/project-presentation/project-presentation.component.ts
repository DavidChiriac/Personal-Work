import { Component, OnInit } from '@angular/core';
import { IProject } from '../../shared/interfaces/project.interface';
import { ActivatedRoute } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../shared/services/device.service';
import { ProjectsService } from '../projects.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SessionStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment';

@UntilDestroy()
@Component({
  selector: 'app-project-presentation',
  imports: [CommonModule, ImageModule],
  templateUrl: './project-presentation.component.html',
  styleUrl: './project-presentation.component.scss',
})
export class ProjectPresentationComponent implements OnInit {
  project: IProject | undefined;

  isMobile!: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly deviceService: DeviceService,
    private readonly projectsService: ProjectsService,
    private readonly sessionStorageService: SessionStorageService
  ) {
    this.isMobile = deviceService.isMobile();
  }

  ngOnInit(): void {
    const cachedProjects = this.sessionStorageService.retrieve('projects');

    if (cachedProjects) {
      this.project = {
        ...cachedProjects.find(
          (project: IProject) =>
            project.slug === this.route.snapshot.params['id']
        ),
      };
    } else {
      this.getProject();
    }
  }

  getProject(): void {
    this.projectsService
      .getSingleProject(this.route.snapshot.params['id'])
      .pipe(untilDestroyed(this))
      .subscribe((project) => {
        console.log(project);
        this.project = {
          ...project.data[0],
          imageUrl:
            (environment.prod ? '' : environment.apiUrl) +
            project.data[0].image?.url,
          presentationImagesUrl: project.data[0].presentationImages?.map(
            (image) => (environment.prod ? '' : environment.apiUrl) + image.url
          ),
        };
      });
  }
}
