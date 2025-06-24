import { Component, ViewChild } from '@angular/core';
import { INotification } from '../models/notification.interface';
import { LeaversService } from '../../leavers.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { SortDirectionEnum } from '../../../shared/utils/sort-directions';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-notifications-table',
  templateUrl: './notifications-table.component.html',
  styleUrl: './notifications-table.component.scss',
  standalone: false
})
export class NotificationsTableComponent {
  @ViewChild('dt') table!: Table;
  notifications: INotification[] = [];
  numberOfNotifications = 0;
  createdOnSorting = -1;

  filters = {
    pageSize: 20,
    pageNumber: 0,
    fieldToSort: '',
    sortDirection: SortDirectionEnum.ASC,
  };

  constructor(private readonly leaversService: LeaversService, private readonly router: Router) {
    this.leaversService.noOfNotifications$.pipe(untilDestroyed(this)).subscribe(numberOfNotifications => this.numberOfNotifications = numberOfNotifications);

    leaversService.notificationsChanged.pipe(untilDestroyed(this)).subscribe(() => {
      this.onLazyLoad();
    });
  }
  
  onLazyLoad(event?: TableLazyLoadEvent): void{
    if(event){
      this.filters = {
        pageSize: event.rows ?? 20,
        pageNumber: (event.first ?? 0) / (event.rows ?? 20),
        fieldToSort: Array.isArray(event.sortField) ? event.sortField[0] : event.sortField ?? '',
        sortDirection: event.sortOrder === -1 ? SortDirectionEnum.DESC : SortDirectionEnum.ASC,
      };

      if(!event.sortField){
        this.filters.fieldToSort = 'createdOn';
        this.filters.sortDirection = this.createdOnSorting === 1 ? SortDirectionEnum.ASC : SortDirectionEnum.DESC;
      }
    }
    this.leaversService.getFilteredNotifications(this.filters).pipe(untilDestroyed(this)).subscribe(notifications => this.notifications = notifications.userNotifications);
  }

  seeNotification(notification: INotification): void {
    this.leaversService.seeNotification(notification);
  }

  markAsRead(notification: INotification): void {
    this.leaversService.markNotificationAsRead(notification).pipe(untilDestroyed(this)).subscribe(() => {
      this.leaversService.notificationsChanged.emit();

      this.leaversService.noOfNotifications$.next(this.numberOfNotifications - 1);
    }
    );
  }

  creationDateSorting(): void {
    this.table.clear();
  }
}
