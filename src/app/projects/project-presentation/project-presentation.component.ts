import { Component, OnInit } from '@angular/core';
import { IProject } from '../../shared/interfaces/project.interface';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../shared/services/projects.service';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-project-presentation',
  imports: [ImageModule],
  templateUrl: './project-presentation.component.html',
  styleUrl: './project-presentation.component.scss',
})
export class ProjectPresentationComponent implements OnInit {
  project!: IProject;

  constructor(
    private route: ActivatedRoute,
    private readonly projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.project = this.projectsService.getSingleProject(
      this.route.snapshot.params['id']
    );
  }
}
