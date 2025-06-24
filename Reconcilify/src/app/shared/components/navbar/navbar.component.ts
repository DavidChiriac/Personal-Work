import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interfaces/User.interface';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { navbar } from './models/navbar-content.constant';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { takeLast } from 'rxjs';
import { AppRolesEnum } from '../../utils/app-roles';
import { SharedServiceService } from '../../services/shared.service';
import { LeaversService } from '../../../leavers/leavers.service';
import { INotification } from '../../../leavers/dashboard/models/notification.interface';
import { INotificationsFilters } from '../../../leavers/dashboard/models/notifications.filters';
import { SortDirectionEnum } from '../../utils/sort-directions';

@UntilDestroy()
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: false
})
export class NavbarComponent implements OnInit {
  @Output() logout = new EventEmitter();
  @Input() isLandingPage = false;
  @Input() isFnBModule = false;
  @Input() isLeaversModule = false;

  user: IUser | undefined;
  userDialogVisible = false;
  notificationsDialogVisible = false;
  administrationDialogVisible = false;
  tasksVisible = false;

  notificationsCount = 0;
  tasksCount = 0;

  administrationPagesAvailable: { label: string; url: string }[] = [];

  items: MenuItem[] = navbar;

  notifications: INotification[] = [];
  lazyLoading: boolean = true;
  lazyNotificationsParams: INotificationsFilters = {
    pageSize: 50,
    pageNumber: 0,
    fieldToSort: 'createdOn',
    sortDirection: SortDirectionEnum.DESC
  };

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly sharedService: SharedServiceService,
    private readonly leaversService: LeaversService
  ) {
    leaversService.notificationsChanged.pipe(untilDestroyed(this)).subscribe(() => {
      this.lazyNotificationsParams.pageNumber = 0;
      this.notifications = [];
      this.onLazyLoad({first: 0});
    });
  }

  ngOnInit(): void {
    this.getUserData();
    this.onLazyLoad({first: 0});

    if (this.user?.roleNames?.includes(AppRolesEnum.ADMIN)) {
      this.administrationPagesAvailable = [
        { label: 'Group Management', url: '/administration/group-management' },
        { label: 'Module Management', url: '/administration/module-management' },
        { label: 'User Management', url: '/administration/user-management' },
      ];
    } else if (this.user?.roleNames?.some(role => [AppRolesEnum.ITEMSHIERARCHYADMIN, AppRolesEnum.LEAVERS_ADMIN].includes(role))) {
      this.administrationPagesAvailable = [
        { label: 'User Management', url: '/administration/user-management' },
      ];
    }

    this.sharedService.tasksSidebarVisible$.pipe(untilDestroyed(this)).subscribe(visible => this.tasksVisible = visible);

    this.leaversService.noOfTasks$.pipe(untilDestroyed(this)).subscribe(noOfTasks => this.tasksCount = noOfTasks);
    this.leaversService.noOfNotifications$.pipe(untilDestroyed(this)).subscribe(noOfNotifications => this.notificationsCount = noOfNotifications);
  }

  getUserData(): void {
    this.authService.currentUser$
      .pipe(untilDestroyed(this))
      .subscribe((user: IUser | null) => {
        if (user) {
          this.user = user;
        }
      });
  }

  signOut(): void {
    this.userDialogVisible = false;
    this.authService
      .logout()
      .pipe(takeLast(1))
      .subscribe(() => {
        this.authService.onLogout.emit();
        this.authService.setCurrentUser(null);
        this.router.navigate(['/login']);
      });
  }

  toggleUserDialog(): void {
    this.userDialogVisible = !this.userDialogVisible;
  }

  toggleNotificationsDialog(): void {
    this.notificationsDialogVisible = !this.notificationsDialogVisible;
  }

  toggleAdministrationDialog(): void {
    this.administrationDialogVisible = !this.administrationDialogVisible;
  }

  onOutsideUserDialogClick(event: Event, button: HTMLElement): void {
    if (button) {
      if (button.contains(event.target as Node)) {
        return; // Prevent closing when clicking the button
      }
    }

    this.userDialogVisible = false;
  }

  onOutsideNotificationsClick(event: Event, button: HTMLElement): void {
    if (button) {
      if (button.contains(event.target as Node)) {
        return; // Prevent closing when clicking the button
      }
    }

    this.notificationsDialogVisible = false;
  }

  onOutsideAdministrationDialogClick(event: Event, button: HTMLElement): void {
    if (button) {
      if (button.contains(event.target as Node)) {
        return;
      }
    }

    this.administrationDialogVisible = false;
  }

  toggleTasksPanel(): void {
    this.tasksVisible = !this.tasksVisible;
    this.sharedService.tasksSidebarVisible$.next(this.tasksVisible);
  }

  navigate(notification: INotification): void {
    const index = this.notifications.findIndex(notif => notif.id === notification.id);
    this.notifications[index] = {
      ...this.notifications[index],
      read: true
    };

    this.leaversService
      .markNotificationAsRead(notification)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: ()=> {
          this.leaversService.notificationsChanged.emit();

          this.leaversService.noOfNotifications$.next(this.notificationsCount - 1);
          this.leaversService.seeNotification(notification);
        }
      }
      );
  }

  onLazyLoad(event: LazyLoadEvent): void {
    const pageReached = ((event.first ?? 0) + 10) >= this.notifications.length;

    if(pageReached && this.notifications.length % this.lazyNotificationsParams.pageSize === 0){
      this.lazyLoading = true;
      this.getNotifications();
      this.lazyNotificationsParams.pageNumber += 1;
    }
  }

  getNotifications(): void {
    this.leaversService
      .getFilteredNotifications(this.lazyNotificationsParams)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (notifications) => {
          this.notifications = [...this.notifications, ...notifications.userNotifications.map(notification => {return {...notification, read: false};})];
          this.lazyLoading = false;
        },
        error: () => {
          this.lazyLoading = false;
        },
      });
  }
}
