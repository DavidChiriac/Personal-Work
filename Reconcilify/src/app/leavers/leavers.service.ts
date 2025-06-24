import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { INotification } from './dashboard/models/notification.interface';
import { INotificationsFilters } from './dashboard/models/notifications.filters';
import { Router } from '@angular/router';
import { SharedServiceService } from '../shared/services/shared.service';
import { NotificationTypeEnum } from './dashboard/models/notification.type';

@Injectable({
  providedIn: 'root'
})
export class LeaversService {
  noOfTasks$ = new BehaviorSubject<number>(0);
  noOfNotifications$ = new BehaviorSubject<number>(0);

  notificationsChanged = new EventEmitter();

  apiUrl = environment.apiUrl + '/api/';

  constructor(private readonly http: HttpClient, private readonly router: Router, private readonly sharedService: SharedServiceService) { }

  getNoTasks(): Observable<{pendingTasks: number}>{
    return this.http.get<{pendingTasks: number}>(this.apiUrl + 'leavers/dashboard/pending-tasks/count');
  }

  getNoOfNotifications(): Observable<number>{
    return this.http.get<number>(this.apiUrl + 'notifications/count');
  }

  getFilteredNotifications(filters: INotificationsFilters): Observable<{userNotifications: INotification[]}>{
    return this.http.post<{userNotifications: INotification[]}>(this.apiUrl + 'notifications', 
      {
        fieldToSort: filters.fieldToSort,
        sortDirection: filters.sortDirection,
        extendedFilterPageDTO: {
          pageSize: filters.pageSize,
          pageNumber: filters.pageNumber
        }
      }
    );
  }

  markNotificationAsRead(notification: INotification): Observable<string> {
    return this.http.patch(this.apiUrl + `notifications/${notification.id}/read`, {}, {responseType: 'text'});
  }

  navigateToTasks(allTasks?: boolean): void {
    if (allTasks) {
      this.router.navigate(['/leavers/leaver-report-acknowledgement'], {
        queryParams: { allTasks: true },
      });
    } else {
      this.router.navigate(['/leavers/leaver-report-acknowledgement']);
    }
  }

  navigateToLeaverReport(filter: string): void {
    const today = new Date();

    switch (filter) {
    case 'day': {
      this.router.navigate(['/leavers/leaver-report'], {
        queryParams: { retrievedOnFrom: this.sharedService.formatDateFilters(today.toISOString()) },
      });
      break;
    }
    case 'week': {
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() + diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      this.router.navigate(['/leavers/leaver-report'], {
        queryParams: { retrievedOnFrom: this.sharedService.formatDateFilters(startOfWeek.toISOString()), retrievedOnTo: this.sharedService.formatDateFilters(today.toISOString()) },
      });

      break;
    }
    case 'backdated': {
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() + diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      this.router.navigate(['/leavers/leaver-report'], {
        queryParams: { 
          retrievedOnFrom: this.sharedService.formatDateFilters(startOfWeek.toISOString()),
          retrievedOnTo: this.sharedService.formatDateFilters(today.toISOString()),
          isBackdatedLeaver: true
        },
      });

      break;
    }
    case 'month': {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      this.router.navigate(['/leavers/leaver-report'], {
        queryParams: { retrievedOnFrom: this.sharedService.formatDateFilters(startOfMonth.toISOString()), retrievedOnTo: this.sharedService.formatDateFilters(today.toISOString()) },
      });
      break;
    }
    case 'year': {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      startOfYear.setHours(0, 0, 0, 0);

      this.router.navigate(['/leavers/leaver-report'], {
        queryParams: { retrievedOnFrom: this.sharedService.formatDateFilters(startOfYear.toISOString()), retrievedOnTo: this.sharedService.formatDateFilters(today.toISOString()) },
      });
      break;
    }
    default:
      this.router.navigate(['/leavers/leaver-report']);
      break;
    }
  }

  seeNotification(notification: INotification): void {
    switch(notification.type){
    case NotificationTypeEnum.NEW_LEAVERS:
      if(this.router.url.startsWith('/leavers/leaver-report')){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/leavers/leaver-report'], {queryParams: {retrievedOnFrom: this.sharedService.formatDateFilters(notification.periodStart), retrievedOnTo: this.sharedService.formatDateFilters(notification.periodEnd)}});
        });
      } else {
        this.router.navigate(['/leavers/leaver-report'], {queryParams: {retrievedOnFrom: this.sharedService.formatDateFilters(notification.periodStart), retrievedOnTo: this.sharedService.formatDateFilters(notification.periodEnd)}});
      }      
      break;
    case NotificationTypeEnum.PENDING_TASKS:
      if(this.router.url.startsWith('/leavers/leaver-report-acknowledgement')){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/leavers/leaver-report-acknowledgement']);
        });
      } else {
        this.router.navigate(['/leavers/leaver-report-acknowledgement']);
      }      
      break;
    case NotificationTypeEnum.BACKDATED_LEAVERS:
      if(this.router.url.startsWith('/leavers/leaver-report')){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/leavers/leaver-report'], {queryParams: {retrievedOnFrom: this.sharedService.formatDateFilters(notification.periodStart), retrievedOnTo: this.sharedService.formatDateFilters(notification.periodEnd), isBackdatedLeaver: true}});
        });
      } else {
        this.router.navigate(['/leavers/leaver-report'], {queryParams: {retrievedOnFrom: this.sharedService.formatDateFilters(notification.periodStart), retrievedOnTo: this.sharedService.formatDateFilters(notification.periodEnd), isBackdatedLeaver: true}});
      }
      break;
    default:
      break;
    }
  }
}
