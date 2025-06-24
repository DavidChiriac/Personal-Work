import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaversComponent } from './leavers.component';
import { SharedServiceService } from '../shared/services/shared.service';
import { LeaversService } from './leavers.service';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { INotification } from './dashboard/models/notification.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LeaversComponent (Jest)', () => {
  let component: LeaversComponent;
  let fixture: ComponentFixture<LeaversComponent>;

  const tasksSidebarVisible$ = new BehaviorSubject<boolean>(false);
  const notifications$ = new BehaviorSubject<INotification[]>([]);
  const noOfTasks$ = new BehaviorSubject<number>(0);

  const sharedServiceMock = {
    tasksSidebarVisible$: tasksSidebarVisible$,
    formatDateFilters: jest.fn((date: string) => date),
  };

  const leaversServiceMock = {
    getTasks: jest.fn(() => of([])),
    getNoTasks: jest.fn(() => of({pendingTasks: 5})),
    getNotifications: jest.fn(() => of([{ id: 1, title: '', body: '', type: '', createdOn: '2023-01-01', retrievedOnFrom: '', retrievedOnTo: null, read: false }])),
    getNoOfNotifications: jest.fn(() => of(3)),

    tasks$: new BehaviorSubject([]),
    noOfTasks$: noOfTasks$,
    notifications$: notifications$,
    noOfNotifications$: new BehaviorSubject(0),
  };

  const routerMock = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaversComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SharedServiceService, useValue: sharedServiceMock },
        { provide: LeaversService, useValue: leaversServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to sharedService.tasksSidebarVisible$', () => {
    tasksSidebarVisible$.next(true);
    expect(component.tasksVisible).toBe(true);
  });

  it('should fetch and set noOfTasks', () => {
    noOfTasks$.next(7);
    expect(component.noOfTasks).toBe(7);
  });

  it('should hide tasks sidebar', () => {
    component.hideTasksSidebar();
    expect(sharedServiceMock.tasksSidebarVisible$.value).toBe(false);
  });

  it('should navigate and hide the sidebar', () => {
    const spy = jest.spyOn(component, 'hideTasksSidebar');
    component.navigate();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/leavers/leaver-report-acknowledgement']);
    expect(spy).toHaveBeenCalled();
  });
});
