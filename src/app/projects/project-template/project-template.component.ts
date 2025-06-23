import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IProject } from '../../shared/interfaces/project.interface';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { DeviceService } from '../../shared/services/device.service';

@Component({
  selector: 'app-project-template',
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './project-template.component.html',
  styleUrl: './project-template.component.scss',
})
export class ProjectTemplateComponent {
  @Input() project!: IProject;
  @Input() index!: number;

  isMobile!: boolean;

  constructor(private readonly deviceService: DeviceService) {
    this.isMobile = deviceService.isMobile();
  }
}
