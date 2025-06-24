import { Component, Input } from '@angular/core';
import { ISystemMetrics } from '../../models/system-metrics.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classification-status-tracker',
  templateUrl: './classification-status-tracker.component.html',
  styleUrl: './classification-status-tracker.component.scss',
  standalone: false
})
export class ClassificationStatusTrackerComponent {
  @Input() data!: ISystemMetrics[];
  @Input() totalData!: ISystemMetrics;

  constructor(private readonly router: Router) {}

  navigate(invalidReason: string, system: string): void {
    this.router.navigate(['FnB-MDH/products-mapping'], {queryParams: {invalidReason: invalidReason, selectedSourceSystems: system}});
  }
}
