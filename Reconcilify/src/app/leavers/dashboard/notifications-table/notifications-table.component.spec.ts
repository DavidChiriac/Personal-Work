import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsTableComponent } from './notifications-table.component';
import { LeaversService } from '../../leavers.service';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { INotification } from '../models/notification.interface';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';

const mockLeaversService = {
  getFilteredNotifications: jest.fn(),
  markNotificationAsRead: jest.fn(),
  seeNotification: jest.fn(),
  noOfNotifications$: new BehaviorSubject(0),
  notificationsChanged: new EventEmitter()
};

const mockRouter = {
  navigate: jest.fn(),
};

describe('NotificationsTableComponent', () => {
  let component: NotificationsTableComponent;
  let fixture: ComponentFixture<NotificationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationsTableComponent],
      providers: [
        { provide: LeaversService, useValue: mockLeaversService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsTableComponent);
    component = fixture.componentInstance;
  });

  it('should update filters and fetch notifications on lazy load', () => {
    const mockNotifications = {userNotifications: [{ id: 1 }, { id: 2 }]};
    const event: TableLazyLoadEvent = {
      first: 20,
      rows: 20,
      sortField: 'createdOn',
      sortOrder: 1,
    };

    mockLeaversService.getFilteredNotifications.mockReturnValue(
      of(mockNotifications)
    );

    component.onLazyLoad(event);

    expect(mockLeaversService.getFilteredNotifications).toHaveBeenCalledWith({
      pageSize: 20,
      pageNumber: 1,
      fieldToSort: 'createdOn',
      sortDirection: 'ASC',
    });

    expect(component.notifications).toEqual(mockNotifications.userNotifications);
  });

  it('should call leaversService.seeNotification with the correct notification', () => {
    const notification = { id: 123 };

    component.seeNotification(notification as INotification);

    expect(mockLeaversService.seeNotification).toHaveBeenCalledWith(
      notification
    );
  });

  it('should mark notification as read and call onLazyLoad', () => {
    const notification = { id: 123 };
    const lazyLoadSpy = jest
      .spyOn(component, 'onLazyLoad')
      .mockImplementation();

    mockLeaversService.markNotificationAsRead.mockReturnValue(of({}));

    component.markAsRead(notification as INotification);

    expect(mockLeaversService.markNotificationAsRead).toHaveBeenCalledWith(
      notification
    );
    expect(lazyLoadSpy).toHaveBeenCalled();
  });

  it('should clear the table on creationDateSorting()', () => {
    component.table = {
      clear: jest.fn(),
    } as unknown as Table;

    component.creationDateSorting();

    expect(component.table.clear).toHaveBeenCalled();
  });

  it('should default to "createdOn" sorting if sortField is not provided', () => {
    const event: TableLazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: undefined,
      sortOrder: undefined,
    };

    mockLeaversService.getFilteredNotifications.mockReturnValue(of([]));
    component.createdOnSorting = 1;

    component.onLazyLoad(event);

    expect(component.filters.fieldToSort).toBe('createdOn');
    expect(component.filters.sortDirection).toBe('ASC');
  });
});
