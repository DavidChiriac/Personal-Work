import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksTableComponent } from './tasks-table.component';
import { ITask } from '../models/tasks.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestingModule } from '../../../shared/testing.module';
import { of } from 'rxjs';
import { DashboardService } from '../dashboard.service';

const mockTasks: {userPendingTasks: ITask[]} = {
  userPendingTasks: [
    { userName: 'John Doe', pendingAcknowledgementTasks: 3, userEmail: 'john.doe@a.com' },
    { userName: 'John Doe', pendingAcknowledgementTasks: 1, userEmail: 'john.doe@a.com' }
  ]
};

const dashboardServiceMock = {
  getTasks: jest.fn().mockReturnValue(of(mockTasks))
};

describe('TasksTableComponent', () => {
  let component: TasksTableComponent;
  let fixture: ComponentFixture<TasksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksTableComponent],
      imports: [TestingModule],
      providers: [{
        provide: DashboardService, useValue: dashboardServiceMock
      }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to getTasks and update tasks', () => {
    expect(component.tasks).toEqual(mockTasks.userPendingTasks);
  });
});
