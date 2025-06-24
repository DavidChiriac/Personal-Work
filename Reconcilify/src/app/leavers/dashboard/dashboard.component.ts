import { Component, OnInit } from '@angular/core';
import { ILeaversKpis } from './models/leavers-kpi.interface';
import { DashboardService } from './dashboard.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LeaversService } from '../leavers.service';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false
})
export class DashboardComponent implements OnInit {
  data: ILeaversKpis = {
    acknowledgementRate: 0,
    pendingAcknowledgementTasks: 0,
    previousDayLeavers: 0,
    currentWeekLeavers: 0,
    currentMonthLeavers: 0,
    yearToDateLeavers: 0,
    totalAcknowledgementTasks: 0,
    currentWeekBackdatedLeavers: 0
  };

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly leaversService: LeaversService
  ) {}

  ngOnInit(): void {
    this.dashboardService
      .getDashboardData()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (kpis: ILeaversKpis) => {
          this.data = kpis;
        },
      });
  }

  navigateToTasks(allTasks?: boolean): void {
    this.leaversService.navigateToTasks(allTasks);
  }

  navigateToLeaverReport(filter: string): void {
    this.leaversService.navigateToLeaverReport(filter);
  }
}
