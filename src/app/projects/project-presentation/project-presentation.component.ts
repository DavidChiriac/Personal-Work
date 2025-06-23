import { Component, OnInit } from '@angular/core';
import { IProject } from '../../shared/interfaces/project.interface';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../shared/services/projects.service';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../shared/services/device.service';

@Component({
  selector: 'app-project-presentation',
  imports: [CommonModule, ImageModule],
  templateUrl: './project-presentation.component.html',
  styleUrl: './project-presentation.component.scss',
})
export class ProjectPresentationComponent implements OnInit {
  project!: IProject;

  isMobile!: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly projectsService: ProjectsService,
    private readonly deviceService: DeviceService
  ) {
    this.isMobile = deviceService.isMobile();
  }

  ngOnInit(): void {
    this.project = this.projectsService.getSingleProject(
      this.route.snapshot.params['id']
    );
  }
}
