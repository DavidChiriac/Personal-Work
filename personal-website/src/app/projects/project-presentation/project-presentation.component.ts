import { Component, Input } from '@angular/core';
import { IProject } from '../../shared/interfaces/project.interface';

@Component({
  selector: 'app-project-presentation',
  imports: [],
  templateUrl: './project-presentation.component.html',
  styleUrl: './project-presentation.component.scss',
})
export class ProjectPresentationComponent {
  @Input() project!: IProject;
}
