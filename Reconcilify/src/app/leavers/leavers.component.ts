import { Component, OnInit } from '@angular/core';
import { AppModulesEnum } from '../shared/utils/app-modules';
import { SharedServiceService } from '../shared/services/shared.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LeaversService } from './leavers.service';
import { INotification } from './dashboard/models/notification.interface';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-leavers',
  templateUrl: './leavers.component.html',
  styleUrl: './leavers.component.scss',
  standalone: false
})
export class LeaversComponent implements OnInit {
  moduleName = AppModulesEnum.LEAVERS;
  tasksVisible = false;

  noOfTasks: number = 0;
  notifications: INotification[] = [];

  constructor(private readonly sharedService: SharedServiceService, private readonly leaversService: LeaversService, private readonly router: Router){}

  ngOnInit(): void {
    this.sharedService.tasksSidebarVisible$.pipe(untilDestroyed(this)).subscribe(visible => this.tasksVisible = visible);
    
    this.leaversService.getNoTasks().pipe(untilDestroyed(this)).subscribe((noOfTasks) => this.leaversService.noOfTasks$.next(noOfTasks.pendingTasks));
    this.leaversService.getNoOfNotifications().pipe(untilDestroyed(this)).subscribe((noOfNotifications) => this.leaversService.noOfNotifications$.next(noOfNotifications));

    this.leaversService.noOfTasks$.pipe(untilDestroyed(this)).subscribe((noOfTasks) => this.noOfTasks = noOfTasks);
  }

  hideTasksSidebar(): void {
    this.sharedService.tasksSidebarVisible$.next(false);
  }

  navigate(): void {
    this.router.navigate(['/leavers/leaver-report-acknowledgement']);
    this.hideTasksSidebar();
  }
}
