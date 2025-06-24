import { Component, OnInit } from '@angular/core';
import { ITask } from '../models/tasks.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DashboardService } from '../dashboard.service';

@UntilDestroy()
@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.scss',
  standalone: false
})
export class TasksTableComponent implements OnInit {
  tasks: ITask[] = [];

  constructor(private readonly dashboardService: DashboardService){}

  ngOnInit(): void {
    this.dashboardService.getTasks().pipe(untilDestroyed(this)).subscribe((tasks) => this.tasks = tasks.userPendingTasks);
  }
}
