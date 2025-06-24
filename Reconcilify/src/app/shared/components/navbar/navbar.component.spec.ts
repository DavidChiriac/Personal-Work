import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { TestingModule } from '../../testing.module';
import { AuthService } from '../../services/auth.service';
import { MockService } from 'ng-mocks';
import { Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { IUser } from '../../interfaces/User.interface';
import { DialogModule } from 'primeng/dialog';
import { SharedServiceService } from '../../services/shared.service';
import { LeaversService } from '../../../leavers/leavers.service';
import { NotificationTypeEnum } from '../../../leavers/dashboard/models/notification.type';
import { LazyLoadEvent } from 'primeng/api';

const currentUser$ = of({
  firstName: 'Valmira',
  lastName: 'Aranitasi',
} as IUser);

const mockAuthService: AuthService = MockService(AuthService, {
  currentUser$,
  logout: jest.fn().mockReturnValue(of(null)),
  onLogout: new EventEmitter<void>(),
});

const mockRouter: Router = MockService(Router, {
  navigate: jest.fn().mockReturnValue(new Promise(()=>{return;})),
});

const leaversServiceMock = {
  getFilteredNotifications: jest.fn().mockReturnValue(of({userNotifications: []})),
  noOfTasks$: new BehaviorSubject(0),
  noOfNotifications$: new BehaviorSubject(0),
  markNotificationAsRead: jest.fn(),
  seeNotification: jest.fn(),
  notificationsChanged: new EventEmitter()
};

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [TestingModule, DialogModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{
        provide: AuthService,
        useValue: mockAuthService
      },{
        provide: Router,
        useValue: mockRouter
      }, {
        provide: LeaversService,
        useValue: leaversServiceMock
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the current user', () => {
    component.ngOnInit();

    expect(component.user?.firstName).toEqual('Valmira');
    expect(component.user?.lastName).toEqual('Aranitasi');
  });

  it('should logout', () => {
    const spyOnRouterNavigate = jest.spyOn(mockRouter, 'navigate');

    component.ngOnInit();
    component.signOut();

    expect(spyOnRouterNavigate).toHaveBeenCalledWith(['/login']);
    expect(component.userDialogVisible).toBeFalsy();
  });

  it('open notification menu', () => {
    component.toggleNotificationsDialog();

    expect(component.notificationsDialogVisible).toBeTruthy();
  });

  it('should prevent user dialog closing when clicking the button', () => {
    const button = document.createElement('button');
    const event = new MouseEvent('click', { bubbles: true });

    jest.spyOn(event, 'target', 'get').mockReturnValue(button);

    component.onOutsideUserDialogClick(event, button);

    expect(component.userDialogVisible).toBe(false);

    component.toggleUserDialog();
    component.onOutsideUserDialogClick(event, button);
    expect(component.userDialogVisible).toBe(true);
  });

  it('should close user dialog when clicking outside the button', () => {
    component.userDialogVisible = true;
    const button = document.createElement('button');
    const event = new MouseEvent('click', { bubbles: true });
    jest.spyOn(event, 'target', 'get').mockReturnValue(document.createElement('div'));

    component.onOutsideUserDialogClick(event, button);

    expect(component.userDialogVisible).toBe(false);
  });

  it('should prevent notification dialog closing when clicking the button', () => {
    const button = document.createElement('button');
    const event = new MouseEvent('click', { bubbles: true });
    jest.spyOn(event, 'target', 'get').mockReturnValue(button);

    component.onOutsideNotificationsClick(event, button);

    expect(component.notificationsDialogVisible).toBe(false);

    component.toggleNotificationsDialog();
    component.onOutsideNotificationsClick(event, button);
    expect(component.notificationsDialogVisible).toBe(true);
  });

  it('should close notification dialog when clicking outside the button', () => {
    component.notificationsDialogVisible = true;
    const button = document.createElement('button');
    const event = new MouseEvent('click', { bubbles: true });
    jest.spyOn(event, 'target', 'get').mockReturnValue(document.createElement('div'));

    component.onOutsideNotificationsClick(event, button);

    expect(component.notificationsDialogVisible).toBe(false);
  });

  it('should toggle tasks panel and update shared service', () => {
    const sharedService = TestBed.inject(SharedServiceService);
    const spy = jest.spyOn(sharedService.tasksSidebarVisible$, 'next');
  
    component.tasksVisible = false;
    component.toggleTasksPanel();
  
    expect(component.tasksVisible).toBe(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should toggle administration dialog', () => {
    component.toggleAdministrationDialog();
    expect(component.administrationDialogVisible).toBe(true);
  
    component.toggleAdministrationDialog();
    expect(component.administrationDialogVisible).toBe(false);
  });

  it('should close administration dialog when clicking outside the button', () => {
    component.administrationDialogVisible = true;
    const button = document.createElement('button');
    const event = new MouseEvent('click', { bubbles: true });
    jest.spyOn(event, 'target', 'get').mockReturnValue(document.createElement('div'));
  
    component.onOutsideAdministrationDialogClick(event, button);
    expect(component.administrationDialogVisible).toBe(false);
  });

  it('should mark notification as read and navigate', () => {
    const notification = { id: 1, title: '', description: '', type: NotificationTypeEnum.NEW_LEAVERS, createdOn: '', periodStart: '', periodEnd: '', read: false };
    const leaversService = TestBed.inject(LeaversService);
    const markAsReadSpy = jest.spyOn(leaversService, 'markNotificationAsRead').mockReturnValue(of(''));
    const seeNotificationSpy = jest.spyOn(leaversService, 'seeNotification');
  
    component.navigate(notification);
  
    expect(markAsReadSpy).toHaveBeenCalledWith(notification);
    expect(seeNotificationSpy).toHaveBeenCalledWith(notification);
  });
  
  it('should update page number and fetch notifications on lazy load', () => {
    const mockEvent: LazyLoadEvent = { first: 20 }; 
    component.lazyNotificationsParams = { pageSize: 20, pageNumber: 0 };

    const mockData = {userNotifications: [{ id: 1 }, { id: 2 }]};
    leaversServiceMock.getFilteredNotifications.mockReturnValueOnce(of(mockData));

    component.onLazyLoad(mockEvent);

    expect(component.lazyNotificationsParams.pageNumber).toBe(1);
    expect(leaversServiceMock.getFilteredNotifications).toHaveBeenCalledWith(component.lazyNotificationsParams);

    expect(component.notifications).toEqual([
      { id: 1, read: false },
      { id: 2, read: false }
    ]);
    expect(component.lazyLoading).toBe(false);
  });

  it('should set lazyLoading to false on error', () => {
    leaversServiceMock.getFilteredNotifications.mockReturnValue(throwError(() => new Error('Error')));

    component.getNotifications();

    expect(leaversServiceMock.getFilteredNotifications).toHaveBeenCalled();
    expect(component.lazyLoading).toBe(false);
  });
});
