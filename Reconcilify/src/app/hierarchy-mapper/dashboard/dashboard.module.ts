import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ClassificationStatusTrackerComponent } from './classification-status-tracker/classification-status-tracker.component';
import { DistributionChartComponent } from './distribution-chart/distribution-chart.component';
import { FnBDashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [FnBDashboardComponent, ClassificationStatusTrackerComponent, DistributionChartComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class DashboardModule { }
